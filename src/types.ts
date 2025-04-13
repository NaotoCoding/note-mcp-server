export interface NotesResponse {
  data: {
    contents: NoteItem[];
    isLastPage: boolean;
    totalCount: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface NoteItem {
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
}
