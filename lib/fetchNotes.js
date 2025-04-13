"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserNotes = fetchUserNotes;
const cheerio = __importStar(require("cheerio"));
// 標準エラー出力にデバッグログを出力
const debug = (...args) => console.error("[DEBUG]", ...args);
// APIエンドポイント
const notesUrl = (userId) => `https://note.com/api/v2/creators/${userId}/contents?kind=note&page=1`;
const getNotePageUrl = (urlname, noteKey) => `https://note.com/${urlname}/n/${noteKey}`;
// JSON取得
function fetchJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(`Fetching: ${url}`);
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
}
// 記事の全文取得
function fetchArticleContent(url, title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            debug(`Fetching article: ${url}`);
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch page: ${response.status}`);
            }
            const html = yield response.text();
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
                if (text)
                    fullText += text + "\n\n";
            });
            // 引用とリスト
            articleContent.find("blockquote").each((_, el) => {
                const text = $(el).text().trim();
                if (text)
                    fullText += "> " + text + "\n\n";
            });
            articleContent.find("li").each((_, el) => {
                const text = $(el).text().trim();
                if (text)
                    fullText += "• " + text + "\n";
            });
            // バックアップとして全テキスト取得
            if (!fullText.trim()) {
                fullText = articleContent.text().trim();
            }
            return `【${title}】\n\n${fullText}\n\n記事URL: ${url}`;
        }
        catch (error) {
            return `【${title}】\n\n(取得エラー)\n\n記事URL: ${url}`;
        }
    });
}
// メイン機能: ユーザーの最新記事を取得
function fetchUserNotes(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // 記事一覧取得
            const response = yield fetchJSON(notesUrl(userId));
            if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.contents) || !Array.isArray(response.data.contents)) {
                throw new Error(`Invalid API response format`);
            }
            const notes = response.data.contents;
            if (notes.length === 0) {
                return ["記事が見つかりませんでした"];
            }
            debug(`Found ${notes.length} notes`);
            // 各記事の全文を取得
            const contents = yield Promise.all(notes.map((note) => {
                const urlname = note.user.urlname;
                const noteKey = note.key;
                const url = getNotePageUrl(urlname, noteKey);
                return fetchArticleContent(url, note.name);
            }));
            return contents;
        }
        catch (error) {
            console.error(`Error fetching notes: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`記事取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
