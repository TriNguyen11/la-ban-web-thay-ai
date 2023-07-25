import React from 'react';
import {
  Navigate
} from "react-router-dom";

import auth_routes from '@floorplan/routes/auth'

const PreviewFromProfile = React.lazy(() => import('@floorplan/views/PreviewFromProfile'))
const PreviewTool = React.lazy(() => import('@floorplan/views/PreviewTool'))
const Preview3DToolReactNative = React.lazy(() => import('@floorplan/views/Preview3DToolReactNative'))

const routes = {
  ...auth_routes,
  preview_from_profile : {
      path : '/floorplan/preview-from-profile/:code',
      name: "Preview",
      exact : false,
      main : <PreviewFromProfile />
  },
  preview_tool : {
    path : '/floorplan/tool',
    name: "Tool",
    exact : false,
    main : <PreviewTool />
  },
  preview_3d_rn : {
    path : '/floorplan/preview-3d-rn',
    name: "Tool 3D React Native",
    exact : false,
    main : <Preview3DToolReactNative />
  },
  // project : {
  //     path : '/floorplan/*',
  //     name: "Project",
  //     exact : false,
  //     main : <Home/>
  // },
  getRoutePath: (path) => {
    for (var i = 0; i < Object.keys(routes).length; i++) {
      let key = Object.keys(routes)[i]
      if (routes[key]!=null && routes[key].path!=null && routes[key].path == path) {
        return routes[key]
      }
    }
    return {}
  },
  getCurrentRoute: () => {
    const { pathname } = location;
    const route = routes.getRoutePath(pathname);
    return route
  },
  getParentRoutePath: (path) => {
    for (var i = 0; i < Object.keys(routes).length; i++) {
      let key = Object.keys(routes)[i]
      if (routes[key]!=null && routes[key].path!=null && path.includes(routes[key].path + '/')) {
        return routes[key]
      }
    }
    return {}
  },
};

export default routes;
