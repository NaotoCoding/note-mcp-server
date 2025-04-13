import { FastMCP } from "fastmcp";
import { z } from "zod";
import { fetchUserNotes } from "./fetchNotes";

// デバッグログをstderrに出力するヘルパー関数
const debug = (...args: any[]) => {
  console.error("[DEBUG]", ...args);
};

debug("Starting Note MCP Server...");

const server = new FastMCP({
  name: "Note MCP Server",
  version: "1.0.0",
});

server.addTool({
  name: "custom_add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (_args) => {
    debug("Executing custom_add tool");
    return {
      type: "text",
      text: "結果は10です。",
    };
  },
});

server.addTool({
  name: "latest_5_notes",
  description: "指定したユーザーIDの最新note記事を取得",
  parameters: z.object({
    userId: z.string().describe("noteのユーザーID (例: fumiseisakusho)"),
  }),
  execute: async (args) => {
    try {
      debug(`Fetching notes for user: ${args.userId}`);
      const articles = await fetchUserNotes(args.userId);
      return {
        type: "text",
        text: articles.join("\n\n---\n\n"),
      };
    } catch (error) {
      console.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return {
        type: "text",
        text: `エラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },
});

debug("Starting server...");
server.start({
  transportType: "stdio",
});
debug("Server started with stdio transport");
