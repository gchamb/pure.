import { useSearchParams } from "react-router";
import { EditorSidebar } from "./editor-sidebar";
import EditorViewer from "./editor-viewer";
import useDirectoryFetch from "@/hooks/use-editor-fetch";

export default function Editor() {
  const [searchParams] = useSearchParams();

  useDirectoryFetch("_main", searchParams.get("directory") ?? "");

  return (
    <div className="h-screen flex gap-10">
      <EditorSidebar />
      <EditorViewer />
    </div>
  );
}
