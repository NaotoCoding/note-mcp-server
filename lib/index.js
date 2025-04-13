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
const fetchNotes_1 = require("./fetchNotes");
// デバッグログをstderrに出力するヘルパー関数
const debug = (...args) => {
    console.error("[DEBUG]", ...args);
};
debug("Starting Note MCP Server...");
const server = new fastmcp_1.FastMCP({
    name: "Note MCP Server",
    version: "1.0.0",
});
server.addTool({
    name: "custom_add",
    description: "Add two numbers",
    parameters: zod_1.z.object({
        a: zod_1.z.number(),
        b: zod_1.z.number(),
    }),
    execute: (_args) => __awaiter(void 0, void 0, void 0, function* () {
        debug("Executing custom_add tool");
        return {
            type: "text",
            text: "結果は10です。",
        };
    }),
});
server.addTool({
    name: "latest_5_notes",
    description: "指定したユーザーIDの最新note記事を取得",
    parameters: zod_1.z.object({
        userId: zod_1.z.string().describe("noteのユーザーID (例: fumiseisakusho)"),
    }),
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            debug(`Fetching notes for user: ${args.userId}`);
            const articles = yield (0, fetchNotes_1.fetchUserNotes)(args.userId);
            return {
                type: "text",
                text: articles.join("\n\n---\n\n"),
            };
        }
        catch (error) {
            console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
            return {
                type: "text",
                text: `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }),
});
debug("Starting server...");
server.start({
    transportType: "stdio",
});
debug("Server started with stdio transport");
