import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  editorStore,
  filePathStore,
  directoryStore,
} from "@/stores/editor-store";
import Directory from "./directory";

// Menu items.
export function EditorSidebar() {
  const directories = useAtomValue(directoryStore);
  const setFilePath = useSetAtom(filePathStore);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {directories.main
                .sort((a, b) => {
                  const aVal = a.isDir ? 1 : 0;
                  const bVal = b.isDir ? 1 : 0;

                  return bVal - aVal;
                })
                .map((item) => (
                  <SidebarMenuItem className="" key={item.name}>
                    {item.isDir ? (
                      <Directory file={item} />
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className="cursor-pointer"
                        onClick={() => setFilePath(item.path)}
                      >
                        <div>
                          <span>{item.name}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
