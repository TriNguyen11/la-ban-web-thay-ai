import React from "react";
import { useNavigate } from "react-router-dom";
import routes from "@floorplan/routes";
import globalState from "@floorplan/system/globalState";
import Language from "@floorplan/system/language";

import auth_apis from "@floorplan/apis/auth";
import axios from "axios";
import * as GLOBAL from "@floorplan/app.json";

const APIs = {
  ...auth_apis,
  getRootCodes: () => {
    return ["square_room", "l_shape_room", "u_shape_room", "t_shape_room"];
  },
  getDoorCodes: () => {
    return [
      "door",
      "window",
      "door-opening",
      "door-double",
      "garage",
      "door-roller",
      "door-sliding",
      "door-sliding-2",
      "door-folding",
      "door-double-folding",
      "door-pocket",
      "door-double-pocket",
    ];
  },
  getFloorplanForm: () => {
    return new Promise((resolve) => {
      let url = GLOBAL.SERVER + "/api/floorplan-objects/form";
      axios
        .get(url)
        .then((response) => {
          resolve(response);
        })
        .catch(function (error) {
          resolve({});
        });
    });
  },
  getFloorObjects: (data = {}) => {
    console.log(GLOBAL.SERVER + "/api/floorplan-objects/list", "chekc url");

    return new Promise((resolve) => {
      let url = GLOBAL.SERVER + "/api/floorplan-objects/list";
      axios
        .post(url, data)
        .then((response) => {
          resolve(response);
        })
        .catch(function (error) {
          resolve({});
        });
    });
  },
  categoryStructure: () => {
    return new Promise((resolve) => {
      let url = GLOBAL.SERVER + "/api/floorplan-category/structure";
      axios
        .get(url)
        .then((response) => {
          resolve(response);
        })
        .catch(function (error) {
          resolve({});
        });
    });
  },
  getFloorItemByCode: (code) => {
    const structures = require("@floorplan/structures.js").default;
    for (var i = 0; i < structures.length; i++) {
      if (Array.isArray(structures[i].children)) {
        const children = structures[i].children;
        for (var j = 0; j < children.length; j++) {
          if (children[j].code == code) {
            return children[j];
            break;
          }
        }
      }
    }
    return {};
  },
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let params = "lang=" + Language.getLanguage();
    config.url = config.url + (!config.url.includes("?") ? "?" : "&") + params;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Read error of axios if return error code from server
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response != null) {
      if (typeof window !== "undefined") {
        const Navigation = require("@floorplan/system/navigation").default;
        switch (error.response.status) {
          case 401:
            APIs.logout();
            window.location.reload();
            break;
          case 403:
            Navigation.navigate(routes.Page403.path);
            break;
          case 405:
            Navigation.navigate(routes.Page405.path);
            break;
          case 500:
            break;
          default:
        }
      }
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

export default APIs;
