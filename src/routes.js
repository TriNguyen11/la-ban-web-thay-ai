import React from "react";
import { Navigate } from "react-router-dom";

import auth_routes from "@floorplan/routes/auth";

const routes = {
  ...auth_routes,
  // project : {
  //     path : '/floorplan/*',
  //     name: "Project",
  //     exact : false,
  //     main : <Home/>
  // },
  getRoutePath: (path) => {
    for (var i = 0; i < Object.keys(routes).length; i++) {
      let key = Object.keys(routes)[i];
      if (
        routes[key] != null &&
        routes[key].path != null &&
        routes[key].path == path
      ) {
        return routes[key];
      }
    }
    return {};
  },
  getCurrentRoute: () => {
    const { pathname } = location;
    const route = routes.getRoutePath(pathname);
    return route;
  },
  getParentRoutePath: (path) => {
    for (var i = 0; i < Object.keys(routes).length; i++) {
      let key = Object.keys(routes)[i];
      if (
        routes[key] != null &&
        routes[key].path != null &&
        path.includes(routes[key].path + "/")
      ) {
        return routes[key];
      }
    }
    return {};
  },
};

export default routes;
