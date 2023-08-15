import Camera from "@floorplan/views/Camera";
import dynamic from "next/dynamic";
import React from "react";

// const Login = React.lazy(() => import('@floorplan/views/auth/Login'))

const Home = React.lazy(() => import("@floorplan/views/Home"));
const VeTinh = React.lazy(() => import("@floorplan/views/VeTinh"));
const LapCuc = dynamic(() => import("@floorplan/views/LapCuc"), {
  ssr: false,
});

const routes = {
  home: {
    path: "/",
    name: "Home",
    auth: true,
    exact: true,
    // main: <div>asdasd</div>,
    main: <Home />,
  },
  camera: {
    path: "/camera",
    name: "Vệ Tinh",
    auth: true,
    exact: true,
    main: <Camera />,
  },
  vetinh: {
    path: "/vetinh",
    name: "Vệ Tinh",
    auth: true,
    exact: true,
    main: <VeTinh />,
  },
  lapcuc: {
    path: "/lapcuc",
    name: "Lập cực",
    auth: true,
    exact: true,
    main: <LapCuc />,
  },
};
export default routes;
