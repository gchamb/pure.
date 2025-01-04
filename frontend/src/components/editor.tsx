import { useSearchParams } from "react-router";
import { EditorSidebar } from "./ui/editor/editor-sidebar";
import { useEffect, useState } from "react";
import { main } from "../../wailsjs/go/models";
import { LoadDirectory, LoadFileContents } from "../../wailsjs/go/main/App";
import EditorViewer from "./ui/editor/editor-viewer";

export default function Editor() {
  const [searchParams] = useSearchParams();
  const [directoryContents, setDirectContents] = useState<main.FileDetails[]>(
    []
  );
  const [currentFileContents, setCurrentFileContents] = useState<string>("");

  const getFileContents = async (path: string) => {
    try {
      const fileContents = await LoadFileContents(path);
      setCurrentFileContents(fileContents);
    } catch (err) {}
  };
  useEffect(() => {
    const getDirectory = async () => {
      try {
        const directory = searchParams.get("directory");
        if (directory === null) {
          return;
        }
        console.log(directory);

        const contents = await LoadDirectory(directory);
        console.log(contents);
        setDirectContents(contents);
      } catch (err) {
        console.log(err);
      }
    };
    getDirectory();
  }, []);

  return (
    <div className="h-screen flex gap-10">
      <EditorSidebar
        directoryContents={directoryContents}
        itemClicked={(path) => getFileContents(path)}
      />
      <EditorViewer fileContents={currentFileContents} />
    </div>
  );
}
