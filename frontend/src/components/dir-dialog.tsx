import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { LoadDirectories } from "../../wailsjs/go/main/App";
import { ArrowLeft, Folder } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { envAtom } from "@/hooks/environment";
import { Checkbox } from "./ui/checkbox";
import { getDirectoryName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function DirDialog(props: { children: ReactNode }) {
  const [directoryPath, setDirectoryPath] = useState<string | undefined>(
    undefined
  );
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  const env = useAtomValue(envAtom);
  const navigate = useNavigate();
  const pathSeparator = env?.platform === "windows" ? "\\" : "/";
  const { data } = useQuery({
    queryKey: [directoryPath ?? ""],
    queryFn: () => LoadDirectories(directoryPath ?? ""),
  });

  const goBack = () => {
    if (data?.currentPath === undefined) {
      return;
    }
    const pathStack = data.currentPath.split(pathSeparator);
    pathStack.pop();
    setDirectoryPath(pathStack.join(pathSeparator));
  };

  const loadDirectory = () => {
    if (data?.currentPath === undefined || selectedDirectory === "") {
      return;
    }
    navigate(
      `/editor?directory=${encodeURIComponent(
        `${data.currentPath}${pathSeparator}${selectedDirectory}`
      )}`
    );
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedDirectory("");
          if (directoryPath !== undefined) {
            setDirectoryPath(undefined);
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
            {directoryPath === ""
              ? "Home"
              : getDirectoryName(data?.currentPath, pathSeparator)}{" "}
            Directory
          </DialogTitle>
          <div className="absolute right-4 flex flex-col items-center">
            <label className="text-black text-xs">Hidden</label>
            <Checkbox
              checked={showHidden}
              onCheckedChange={() => setShowHidden((p) => !p)}
            />
          </div>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[400px] grid grid-cols-2 gap-6">
          {data?.dirs
            .filter((dir) => {
              if (showHidden) {
                return dir;
              }
              const dirName = getDirectoryName(dir, pathSeparator);
              return dirName.charAt(0) !== ".";
            })
            .map((dir, index) => {
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
                  onDoubleClick={() =>
                    setDirectoryPath(
                      `${data.currentPath}${pathSeparator}${dir}`
                    )
                  }
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
