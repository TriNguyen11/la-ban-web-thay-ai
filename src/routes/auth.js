import React from "react";

// const Login = React.lazy(() => import('@floorplan/views/auth/Login'))

const Home = React.lazy(() => import("@floorplan/views/Home"));
const VeTinh = React.lazy(() => import("@floorplan/views/VeTinh"));
const LapCuc = React.lazy(() => import("@floorplan/views/LapCuc"));

const routes = {
  home: {
    path: "/",
    name: "Home",
    auth: true,
    exact: true,
    // main: <div>asdasd</div>,
    main: <Home />,
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
