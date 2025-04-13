type NotesResponse = {
  data: {
    contents: {
      id: string;
      key: string;
      name: string;
      body: string;
      user: {
        urlname: string;
        name: string;
      };
      publishAt: string;
      [key: string]: any;
    }[];
    isLastPage: boolean;
    totalCount: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export async function fetchNoteKeys(userId: string): Promise<string[]> {
  const notesApiUrl = `https://note.com/api/v2/creators/${userId}/contents?kind=note&page=1`;
  try {
    const response = await fetch(notesApiUrl);
    const notes: NotesResponse = await response.json();
    const noteKeys = notes.data.contents.map((note) => note.key);
    return noteKeys;
  } catch (error) {
    throw new Error(`Failed to fetch notes: ${error}`);
  }
}
