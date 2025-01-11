import useDirectoryFetch from "@/hooks/use-editor-fetch";
import { main } from "../../../wailsjs/go/models";
import { useAtomValue, useSetAtom } from "jotai";
import {
  directoryStore,
  filePathStore,
} from "@/stores/editor-store";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function Directory({ file }: { file: main.FileDetails }) {
  const [open, setOpen] = useState(false);
  const directories = useAtomValue(directoryStore);
  const setFilePath = useSetAtom(filePathStore);

  useDirectoryFetch(file.name, file.path);

  return (
    <Collapsible onOpenChange={(o) => setOpen(o)} className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {file.name}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className="overflow-auto min-h-[50px]">
            <SidebarMenuSub>
              {open &&
                directories[file.name] &&
                directories[file.name]
                  .sort((a, b) => {
                    const aVal = a.isDir ? 1 : 0;
                    const bVal = b.isDir ? 1 : 0;

                    return bVal - aVal;
                  })
                  .map((item) => {
                    return (
                      <SidebarMenuItem>
                        {item.isDir ? (
                          <Directory file={item} />
                        ) : (
                          <SidebarMenuSubButton
                            onClick={() => setFilePath(item.path)}
                            className="text-left cursor-pointer"
                          >
                            {item.name}
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
            </SidebarMenuSub>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
