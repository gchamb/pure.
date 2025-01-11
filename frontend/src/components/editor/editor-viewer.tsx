import { useQuery } from "@tanstack/react-query";
import { LoadFileContents } from "../../../wailsjs/go/main/App";
import { SidebarTrigger } from "../ui/sidebar";
import { useAtomValue } from "jotai";
import { filePathStore } from "@/stores/editor-store";

export default function EditorViewer() {
  const filePath = useAtomValue(filePathStore);
  const fileContents = useQuery({
    queryKey: [filePath],
    queryFn: () => LoadFileContents(filePath ?? ""),
  });

  return (
    <div className="">
      <SidebarTrigger />
      <pre className="text-left">
        <code>{fileContents.data}</code>
      </pre>
    </div>
  );
}
