import { Components, globalState, Navigation, routes } from "@floorplan/App";

export const routingNavigateBottom = [
  {
    title: "Vật lý",
    icon: "icon-vat-ly",
    onClick: () => {
      Navigation.navigate(routes.home.path);
    },
  },
  {
    title: "Vệ tinh",
    icon: "icon-ve-tinh",
    onClick: () => {
      Navigation.navigate(routes.vetinh.path);
    },
  },
  {
    title: "Lập cực",
    icon: "icon-lap-cuc",
    onClick: () => {
      Navigation.navigate(routes.lapcuc.path);
    },
  },
];
