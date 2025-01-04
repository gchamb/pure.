import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import { SidebarProvider } from "./components/ui/sidebar";
import { HashRouter, Route, Routes } from "react-router";
import Home from "./components/home";
import Editor from "./components/editor";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <SidebarProvider>
      <HashRouter basename={"/"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </HashRouter>
    </SidebarProvider>
  </React.StrictMode>
);
