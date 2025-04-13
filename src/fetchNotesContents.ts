import { fetchNoteContent } from "./fetchNoteContent";
import { fetchNoteKeys } from "./fetchNoteKeys";

export async function fetchNotesContents(userId: string): Promise<string[]> {
  try {
    const noteKeys = await fetchNoteKeys(userId);

    const contents = await Promise.all(
      noteKeys.map((noteKey) => fetchNoteContent(userId, noteKey))
    );

    return contents;
  } catch (error) {
    throw new Error(
      `記事取得に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
