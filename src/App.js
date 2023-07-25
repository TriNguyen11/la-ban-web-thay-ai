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
import Objects from '@floorplan/views/objects/index'

const App = () => {
  return typeof document !== "undefined" ? (
    <>
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
  Objects
};
