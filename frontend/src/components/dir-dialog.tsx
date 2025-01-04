import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { LoadDirectories } from "../../wailsjs/go/main/App";
import { ArrowLeft, Folder } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { envAtom } from "@/hooks/environment";

export default function DirDialog(props: { children: ReactNode }) {
  const [directoryPath, setDirectoryPath] = useState<string | undefined>(
    undefined
  );
  const [dirs, setDirs] = useState<string[]>([]);
  const [path, setPath] = useState<string>();
  const [selectedDirectory, setSelectedDirectory] = useState("");

  const env = useAtomValue(envAtom);
  const navigate = useNavigate();
  const pathSeparator = env?.platform === "windows" ? "\\" : "/";

  const goBack = () => {
    if (path === undefined) {
      return;
    }
    const pathStack = path.split(pathSeparator);
    pathStack.pop();
    setDirectoryPath(pathStack.join(pathSeparator));
  };
  const getDirectoryName = () => {
    if (path === undefined) {
      return "";
    }
    const pathStack = path.split(pathSeparator);
    return pathStack[pathStack.length - 1];
  };
  const loadDirectories = useCallback(async () => {
    try {
      console.log("called", directoryPath, directoryPath ?? "");
      // get the directories from home
      // allow user to click into directories
      // allow user to click out of directories
      // allow user to select a directory
      const dirs = await LoadDirectories(directoryPath ?? "");
      setPath(dirs.currentPath);
      setDirs(dirs.Dirs);
    } catch (err) {
      console.log(err);
    }
  }, [directoryPath]);
  const loadDirectory = () => {
    if (path === undefined || selectedDirectory === "") {
      return;
    }
    navigate(
      `/editor?directory=${encodeURIComponent(`${path}${pathSeparator}${selectedDirectory}`)}`
    );
  };
  useEffect(() => {
    loadDirectories();
  }, [loadDirectories]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedDirectory("");
          if (directoryPath !== undefined) {
            setDirectoryPath(undefined);
            setPath("");

            setDirs([]);
          }
        }
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="gap-10">
        <DialogHeader className="relative">
          <div className="absolute left-4 top-0">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="text-black" size={12} />
            </Button>
          </div>
          <DialogTitle className="text-black text-center">
            {directoryPath === "" ? "Home" : getDirectoryName()} Directory
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[400px] grid grid-cols-2 gap-6">
          {dirs.map((dir, index) => {
            if (dir === "") {
              return <></>;
            }

            return (
              <button
                key={index}
                className={`flex flex-col gap-y-2 items-center p-2 ${
                  selectedDirectory === dir && "bg-slate-200 rounded"
                }`}
                onClick={async () => {
                  if (selectedDirectory === dir) {
                    setSelectedDirectory("");
                    return;
                  }
                  setSelectedDirectory(dir);
                }}
                onDoubleClick={() => setDirectoryPath(`${path}${pathSeparator}${dir}`)}
              >
                <Folder className="text-black" size={20} />
                <span className="text-black text-sm">{dir}</span>
              </button>
            );
          })}
        </div>
        {selectedDirectory && (
          <DialogFooter>
            <Button onClick={loadDirectory}>Select Folder</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
