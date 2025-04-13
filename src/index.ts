import { FastMCP } from "fastmcp";
import { z } from "zod";
import { fetchNotesContents } from "./fetchNotesContents";

const server = new FastMCP({
  name: "Note MCP Server",
  version: "1.0.0",
});

server.addTool({
  name: "recent_notes",
  description: "指定したユーザーIDの最新note記事を取得",
  parameters: z.object({
    userId: z.string().describe("noteのユーザーID (例: fumiseisakusho)"),
  }),
  execute: async (args) => {
    try {
      const articles = await fetchNotesContents(args.userId);
      return {
        type: "text",
        text: articles.join("\n\n---\n\n"),
      };
    } catch (error) {
      return {
        type: "text",
        text: `エラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },
});

server.start({ transportType: "stdio" });
