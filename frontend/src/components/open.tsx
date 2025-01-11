import { FolderOpen, File } from "lucide-react";
import { useState } from "react";
import DirDialog from "./dir-dialog";
import { Button } from "./ui/button";

export default function Open() {
  return (
    <div className="flex gap-x-4">
      <DirDialog>
        <Button className="min-w-[100px] min-h-[75px]">
          <FolderOpen size={54} />
        </Button>
      </DirDialog>
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
