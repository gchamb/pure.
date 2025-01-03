import { FolderOpen, File } from "lucide-react";
import { useState } from "react";
import DirDialog from "./dir-dialog";

export default function Open() {
  return (
    <div className="flex gap-x-4">
      <DirDialog>
        <button className="p-2 border border-white rounded">
          <FolderOpen size={54} />
        </button>
      </DirDialog>
      <button className="p-2 border border-white rounded" onClick={() => {}}>
        <File size={54} />
      </button>
    </div>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}
