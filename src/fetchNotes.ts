import * as cheerio from "cheerio";
import { NoteItem, NotesResponse } from "./types";

// 標準エラー出力にデバッグログを出力
const debug = (...args: any[]) => console.error("[DEBUG]", ...args);

// APIエンドポイント
const notesUrl = (userId: string) =>
  `https://note.com/api/v2/creators/${userId}/contents?kind=note&page=1`;

const getNotePageUrl = (urlname: string, noteKey: string) =>
  `https://note.com/${urlname}/n/${noteKey}`;

// JSON取得
async function fetchJSON<T>(url: string): Promise<T> {
  debug(`Fetching: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 記事の全文取得
async function fetchArticleContent(
  url: string,
  title: string
): Promise<string> {
  try {
    debug(`Fetching article: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articleContent = $(".o-noteContentText");

    if (articleContent.length === 0) {
      return `【${title}】\n\n(内容を取得できませんでした)\n\n記事URL: ${url}`;
    }

    // テキスト抽出
    let fullText = "";

    // 各要素から順にテキストを抽出
    articleContent.find("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += text + "\n\n";
    });

    // 引用とリスト
    articleContent.find("blockquote").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += "> " + text + "\n\n";
    });

    articleContent.find("li").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += "• " + text + "\n";
    });

    // バックアップとして全テキスト取得
    if (!fullText.trim()) {
      fullText = articleContent.text().trim();
    }

    return `【${title}】\n\n${fullText}\n\n記事URL: ${url}`;
  } catch (error) {
    return `【${title}】\n\n(取得エラー)\n\n記事URL: ${url}`;
  }
}

// メイン機能: ユーザーの最新記事を取得
export async function fetchUserNotes(userId: string): Promise<string[]> {
  try {
    // 記事一覧取得
    const response = await fetchJSON<NotesResponse>(notesUrl(userId));

    if (!response.data?.contents || !Array.isArray(response.data.contents)) {
      throw new Error(`Invalid API response format`);
    }

    const notes = response.data.contents;
    if (notes.length === 0) {
      return ["記事が見つかりませんでした"];
    }

    debug(`Found ${notes.length} notes`);

    // 各記事の全文を取得
    const contents = await Promise.all(
      notes.map((note) => {
        const urlname = note.user.urlname;
        const noteKey = note.key;
        const url = getNotePageUrl(urlname, noteKey);
        return fetchArticleContent(url, note.name);
      })
    );

    return contents;
  } catch (error) {
    console.error(
      `Error fetching notes: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw new Error(
      `記事取得に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
