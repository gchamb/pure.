import { editorStore } from "@/stores/editor-store";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { LoadDirectory } from "../../wailsjs/go/main/App";

export default function useDirectoryFetch(dir: string, path: string) {
  const { data } = useQuery({
    queryKey: [dir],
    queryFn: () => LoadDirectory(path),
  });
  const [editor, setEditorStore] = useAtom(editorStore);

  useEffect(() => {
    if (data !== undefined) {
      const directories = editor.directories;

      if (dir === "_main") {
        directories.main = data;
      } else {
        directories[dir] = data;
      }

      setEditorStore({ ...editor, directories });
    }
  }, [data]);
}
