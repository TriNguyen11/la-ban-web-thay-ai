import Globals from "../app.json";

import Request from "./Request";

var request = new Request();

// const routes = require("@Resource/routes").default;
// import uuid from "react-native-uuid";

export default {
  getCompasses: () => {
    return [
      { name: "Mặc định", image: "/la-ban/24-son-huong.png" },
      // {name: '24 Sơn Hướng', image: '/la-ban/24-son-huong.png')},
      { name: "60 Hoa Giáp", image: "/la-ban/60-hoa-giap.png" },
      // {name: '72 Xuyên Sơn Long', image: '/la-ban/72-xuyen-son-long.png')}
    ];
  },
  getLabanVeTinhs: () => {
    return [
      {
        name: "Mặc định",
        image: "/la-ban-ve-tinh/mac-dinh.png",
      },
      // {name: '24 Sơn Hướng', image: '/la-ban-ve-tinh/24-son-huong.png')}
    ];
  },
  getLabanLapCucs: () => {
    return [{ name: "Mặc định", image: "/lap-cuc/mac-dinh.png" }];
  },
  caculateAngle: (magnetometer) => {
    console.log(magnetometer, "magnetometer");
    let angle;
    if (magnetometer) {
      // let { x, y, z } = magnetometer;
      if (Math.atan2(magnetometer.y, magnetometer.x) >= 0) {
        angle = Math.atan2(magnetometer.y, magnetometer.x) * (180 / Math.PI);
      } else {
        angle =
          (Math.atan2(magnetometer.y, magnetometer.x) + 2 * Math.PI) *
          (180 / Math.PI);
      }
    }
    const re = Math.round(angle * 10) / 10;
    // console.log(re)
    return re;
  },
  getDirectionName: (angle = 0) => {
    let directionName = "Bắc";
    if ((angle <= 360 && angle >= 337.5) || (angle >= 0 && angle <= 22.5)) {
      directionName = "Bắc";
    } else if (angle >= 22.5 && angle <= 67.5) {
      directionName = "Đông Bắc";
    } else if (angle >= 67.5 && angle <= 112.5) {
      directionName = "Đông";
    } else if (angle >= 112.5 && angle <= 157.5) {
      directionName = "Đông Nam";
    } else if (angle >= 157.5 && angle <= 202.5) {
      directionName = "Nam";
    } else if (angle >= 202.5 && angle <= 247.5) {
      directionName = "Tây Nam";
    } else if (angle >= 247.5 && angle <= 292.5) {
      directionName = "Tây";
    } else if (angle >= 292.5 && angle <= 337.5) {
      directionName = "Tây Bắc";
    }
    return directionName;
  },
  getDirectionPhongThuyName: (angle = 0) => {
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
  },
  getDoSonHuongs: () => {
    return [
      { name: "Nhâm", value: 345 },
      { name: "Tý", value: 0 },
      { name: "Quý", value: 15 },
      { name: "Sửu", value: 30 },
      { name: "Cấn", value: 45 },
      { name: "Dần", value: 60 },
      { name: "Giáp", value: 75 },
      { name: "Mão", value: 90 },
      { name: "Ất", value: 105 },
      { name: "Thìn", value: 120 },
      { name: "Tốn", value: 135 },
      { name: "Tỵ", value: 150 },
      { name: "Bính", value: 165 },
      { name: "Ngọ", value: 180 },
      { name: "Đinh", value: 195 },
      { name: "Mùi", value: 210 },
      { name: "Khôn", value: 225 },
      { name: "Thân", value: 240 },
      { name: "Canh", value: 255 },
      { name: "Dậu", value: 270 },
      { name: "Tân", value: 285 },
      { name: "Tuất", value: 300 },
      { name: "Càn", value: 315 },
      { name: "Hợi", value: 330 },
    ];
  },
  searchAddressGoogleAPI: (text = "") => {
    const url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      text +
      "&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=" +
      Globals.google_map_api_key;
    // console.log(url)
    return new Promise((resolve) => {
      request = new Request({
        url: url,
        method: "GET",
        timeout: 15000,
      });
      request
        .call()
        .then((json) => {
          resolve(json);
        })
        .catch((er) => {
          console.log(er);
          resolve({ errors: { connection: [er] } });
        });
    });
  },
  // saveSearchLocationHistory: (add) => {
  //   let json = { ...add };
  //   json.id = uuid.v4();
  //   console.log(json);
  //   const Histories = require("@Histories").default;
  //   Histories.add("map-addresses", json);
  // },
  // getSearchLocationHistories: async () => {
  //   const Histories = require("@Histories").default;
  //   let addresses = await Histories.get("map-addresses");
  //   if (addresses != null && Array.isArray(addresses)) {
  //     return addresses;
  //   }
  //   return [];
  // },
  getMapTypes: () => {
    return [
      {
        name: "Satellite",
        code: "satellite",
        image:
          "https://maps.gstatic.com/tactile/layerswitcher/ic_terrain-1x.png",
      },
      {
        name: "Terrain",
        code: "terrain",
        image:
          "https://maps.gstatic.com/tactile/layerswitcher/ic_transit-1x.png",
      },
    ];
  },
};
