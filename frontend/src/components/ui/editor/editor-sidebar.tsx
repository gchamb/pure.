import { Calendar, Folder, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { main } from "../../../../wailsjs/go/models";

type EditorSidebarProps = {
  directoryContents: main.FileDetails[];
  itemClicked: (path: string) => void;
};
// Menu items.
export function EditorSidebar(props: EditorSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {props.directoryContents.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                    onClick={() => props.itemClicked(item.path)}
                  >
                    <div>
                      {item.isDir && (
                        <Folder className="text-black" size={12} />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
