"use client";

import React from "react";
import * as Components from "@floorplan/components/index";
import { BrowserRouter } from "react-router-dom";
import APIs from "@floorplan/apis";
import Helper from "@floorplan/helper";
import routes from "@floorplan/routes";
import System from "@floorplan/system/system";

import globalState from "@floorplan/system/globalState";
import Notify from "@floorplan/system/messages";
import View from "@floorplan/system/view";
import Lang from "@floorplan/system/language";
import Navigation from "@floorplan/system/navigation";
import Event from "@floorplan/system/event";

import { AppProvider } from "@floorplan/provider";
import Objects from "@floorplan/views/objects/index";
import "./scss/floorplan.scss";
import Head from "next/head";
const App = () => {
  return typeof document !== "undefined" ? (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>Web Dev Tutor</title>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script src="https://unpkg.com/konva@9.2.0/konva.min.js"></script>
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script> */}
      </Head>
      <AppProvider>
        <BrowserRouter>
          <Components.ScrollToTop>
            <Components.Content />
          </Components.ScrollToTop>
        </BrowserRouter>
      </AppProvider>
    </>
  ) : (
    <></>
  );
};

export default App;
export {
  APIs,
  routes,
  Components,
  globalState,
  Notify,
  View,
  Lang,
  Navigation,
  Event,
  System,
  Helper,
  Objects,
};
