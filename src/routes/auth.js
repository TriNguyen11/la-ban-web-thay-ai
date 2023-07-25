import React from "react";

// const Login = React.lazy(() => import('@floorplan/views/auth/Login'))

const CreateNewProject = React.lazy(() =>
  import("@floorplan/views/CreateNewProject")
);
const FloorPlanInfo = React.lazy(() =>
  import("@floorplan/views/FloorPlanInfo")
);

const routes = {
  // login: {
  //     path  : '/floorplan/login',
  //     name  : "Login",
  //     auth  : true,
  //     exact : true,
  //     main  : <Login />
  // },
  home: {
    path: "/",
    name: "Create New Project",
    auth: true,
    exact: true,
    main: <CreateNewProject />,
  },
  createnewproject: {
    path: "/floorplan/createnewproject",
    name: "Create New Project",
    auth: true,
    exact: true,
    main: <CreateNewProject />,
  },
  floorplan_info: {
    path: "/floorplan/:id",
    name: "Project",
    auth: true,
    exact: false,
    main: <FloorPlanInfo />,
  },
};

export default routes;
