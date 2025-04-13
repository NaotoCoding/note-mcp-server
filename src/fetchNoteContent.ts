import * as cheerio from "cheerio";

export async function fetchNoteContent(
  userId: string,
  noteKey: string
): Promise<string> {
  const notePageUrl = `https://note.com/${userId}/n/${noteKey}`;

  try {
    const response = await fetch(notePageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const noteContent = $(".o-noteContentText");

    if (noteContent.length === 0) {
      return `(内容を取得できませんでした)\n\n記事URL: ${notePageUrl}`;
    }

    let fullText = "";
    noteContent.find("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += text + "\n\n";
    });
    noteContent.find("blockquote").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += "> " + text + "\n\n";
    });
    noteContent.find("li").each((_, el) => {
      const text = $(el).text().trim();
      if (text) fullText += "• " + text + "\n";
    });

    return `${fullText}\n\n`;
  } catch (error) {
    return `(取得エラー)\n\n記事URL: ${notePageUrl}`;
  }
}
