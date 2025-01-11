import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { main } from "../../wailsjs/go/models";

export type EditorStore = {
  directories: {
    main: main.FileDetails[];
    [key: string]: main.FileDetails[];
  };
  currentFilePath?: string;
};

export const editorStore = atom<EditorStore>({ directories: { main: [] } });
export const directoryStore = focusAtom(editorStore, (optic) =>
  optic.prop("directories")
);
export const filePathStore = focusAtom(editorStore, (optic) =>
  optic.prop("currentFilePath")
);
