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
exports.fetchNotesContents = fetchNotesContents;
const fetchNoteContent_1 = require("./fetchNoteContent");
const fetchNoteIds_1 = require("./fetchNoteIds");
function fetchNotesContents(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const noteIds = yield (0, fetchNoteIds_1.fetchNoteIds)(userId);
            const contents = yield Promise.all(noteIds.map((noteId) => (0, fetchNoteContent_1.fetchNoteContent)(userId, noteId)));
            return contents;
        }
        catch (error) {
            throw new Error(`記事取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
