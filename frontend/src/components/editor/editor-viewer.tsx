import { useQuery } from "@tanstack/react-query";
import { LoadFileContents } from "../../../wailsjs/go/main/App";
import { SidebarTrigger } from "../ui/sidebar";
import { useAtomValue } from "jotai";
import { filePathStore } from "@/stores/editor-store";
import { Rope } from "@/lib/ds/rope";

export default function EditorViewer() {
  const filePath = useAtomValue(filePathStore);
  const fileContents = useQuery({
    queryKey: [filePath],
    queryFn: () => LoadFileContents(filePath ?? ""),
    select: (contents) => {
      return new Rope(contents);
    },
  });
  console.log(new Array());
  console.log(new Array(fileContents.data?.getLineCount()).fill(null));
  return (
    <div className="">
      <SidebarTrigger />
      <pre className="text-left">
        {new Array(fileContents.data?.getLineCount())
          .fill(null)
          .map((line, index) => {
            return (
              <code className="flex gap-x-4">
                <span>{index + 1}</span>
                {/* {fileContents.data?.getLine(index)} */}
              </code>
            );
          })}
      </pre>
    </div>
  );
}
