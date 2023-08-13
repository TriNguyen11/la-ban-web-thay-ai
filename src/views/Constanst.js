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
export const getDirectionPhongThuyName = (angle = 0) => {
  let directionName = "Tý";
  if ((angle <= 360 && angle >= 352.5) || (angle >= 0 && angle <= 7.5)) {
    directionName = "Tý";
  } else if (angle >= 7.5 && angle <= 22.5) {
    directionName = "Quí";
  } else if (angle >= 22.5 && angle <= 35.5) {
    directionName = "Sửu";
  } else if (angle >= 35.5 && angle <= 52.5) {
    directionName = "Cấn";
  } else if (angle >= 52.5 && angle <= 67.5) {
    directionName = "Dần";
  } else if (angle >= 67.5 && angle <= 82.5) {
    directionName = "Giáp";
  } else if (angle >= 82.5 && angle <= 97.5) {
    directionName = "Mão";
  } else if (angle >= 97.5 && angle <= 112.5) {
    directionName = "Ất";
  } else if (angle >= 112.5 && angle <= 127.5) {
    directionName = "Thìn";
  } else if (angle >= 127.5 && angle <= 142.5) {
    directionName = "Tốn";
  } else if (angle >= 142.5 && angle <= 157.5) {
    directionName = "Tỵ";
  } else if (angle >= 157.5 && angle <= 172.5) {
    directionName = "Bính";
  } else if (angle >= 172.5 && angle <= 187.5) {
    directionName = "Ngọ";
  } else if (angle >= 187.5 && angle <= 202.5) {
    directionName = "Đinh";
  } else if (angle >= 202.5 && angle <= 217.5) {
    directionName = "Mùi";
  } else if (angle >= 217.5 && angle <= 232.5) {
    directionName = "Khôn";
  } else if (angle >= 232.5 && angle <= 247.5) {
    directionName = "Thân";
  } else if (angle >= 247.5 && angle <= 262.5) {
    directionName = "Canh";
  } else if (angle >= 262.5 && angle <= 277.5) {
    directionName = "Dậu";
  } else if (angle >= 277.5 && angle <= 292.5) {
    directionName = "Tân";
  } else if (angle >= 292.5 && angle <= 307.5) {
    directionName = "Tuất";
  } else if (angle >= 307.5 && angle <= 322.5) {
    directionName = "Càn";
  } else if (angle >= 322.5 && angle <= 337.5) {
    directionName = "Hợi";
  } else if (angle >= 337.5 && angle <= 352.5) {
    directionName = "Nhâm";
  }
  return directionName;
};
