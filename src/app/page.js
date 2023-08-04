"use client";

import App from "@floorplan/App";
import CreateNewProject from "@floorplan/views/Home";
import Image from "next/image";

import React, { useEffect } from "react";
// import ReactDOM from 'react-dom'
import { createRoot } from "react-dom/client";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "@floorplan/app/page.scss";
export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = createRoot(document.getElementById("application"));
      root.render(
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      );
    }
  }, []);
}
