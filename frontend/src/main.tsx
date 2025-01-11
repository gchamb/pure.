import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import { SidebarProvider } from "./components/ui/sidebar";
import { HashRouter, Route, Routes } from "react-router";
import Home from "./components/home";
import Editor from "./components/editor/editor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("root");

const root = createRoot(container!);

const client = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <SidebarProvider>
        <HashRouter basename={"/"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </HashRouter>
      </SidebarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
