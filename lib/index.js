"use strict";
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
const fastmcp_1 = require("fastmcp");
const zod_1 = require("zod");
const fetchNotesContents_1 = require("./fetchNotesContents");
const server = new fastmcp_1.FastMCP({
    name: "Note MCP Server",
    version: "1.0.0",
});
server.addTool({
    name: "recent_notes",
    description: "指定したユーザーIDの最新note記事を取得",
    parameters: zod_1.z.object({
        userId: zod_1.z.string().describe("noteのユーザーID (例: fumiseisakusho)"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const articles = yield (0, fetchNotesContents_1.fetchNotesContents)(args.userId);
            return {
                type: "text",
                text: articles.join("\n\n---\n\n"),
            };
        }
        catch (error) {
            return {
                type: "text",
                text: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }),
});
server.start({ transportType: "stdio" });
