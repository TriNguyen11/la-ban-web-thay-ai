import Notify from "@floorplan/system/messages";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import html2canvas from "html2canvas";
import * as pico from "@gripeless/pico";

const Helpers = {
  copyToClipboard: (content = "") => {
    if (typeof window !== "undefined") {
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      Notify.notify({ type: "success", title: "Coppied" });
    }
  },
  makeRootWalls: (root) => {
    let walls = [];
    if (!Array.isArray(root.polygons) || root.polygons.length <= 2) {
      return walls;
    }
    const wallHeight = 10;
    for (var i = 0; i < root.polygons.length; i++) {
      if (root.polygons[i + 1]) {
        // let [x,y] = Helpers.findOut1In4PartInside(root.polygons[i],root.polygons,wallHeight/2)
        // let [endX,endY] = Helpers.findOut1In4PartInside(root.polygons[i + 1],root.polygons,wallHeight/2)
        let x = root.polygons[i][0];
        let y = root.polygons[i][1];
        let endX = root.polygons[i + 1][0];
        let endY = root.polygons[i + 1][1];
        let width = Math.sqrt(Math.pow(endX - x, 2) + Math.pow(endY - y, 2));
        walls.push({
          parent: root.id,
          name: "Wall",
          id: "wall-" + uuidv4(),
          code: "wall",
          x: x,
          y: y,
          endX: endX,
          endY: endY,
          width: width,
          height: wallHeight,
        });
      }
    }
    // let [x,y] = Helpers.findOut1In4PartInside(root.polygons[root.polygons.length - 1],root.polygons,wallHeight/2)
    // let [endX,endY] = Helpers.findOut1In4PartInside(root.polygons[0],root.polygons,wallHeight/2)
    let x = root.polygons[root.polygons.length - 1][0];
    let y = root.polygons[root.polygons.length - 1][1];
    let endX = root.polygons[0][0];
    let endY = root.polygons[0][1];
    let width = Math.sqrt(Math.pow(endX - x, 2) + Math.pow(endY - y, 2));
    walls.push({
      parent: root.id,
      name: "Wall",
      id: "wall-" + uuidv4(),
      code: "wall",
      x: x,
      y: y,
      endX: endX,
      endY: endY,
      width: width,
      height: wallHeight,
    });
    return walls;
  },
  findOut1In4PartInside: (point, polygons, height) => {
    const newPoints = [
      [point[0] - height, point[1] - height],
      [point[0] - height, point[1] + height],
      [point[0] + height, point[1] - height],
      [point[0] + height, point[1] + height],
    ];

    for (var i = 0; i < newPoints.length; i++) {
      if (Helpers.checkPointIsInsidePolygons(newPoints[i], polygons)) {
        // console.log(i+':',point,newPoints[i])
        return newPoints[i];
      }
    }
    return point;
  },
  checkPointIsInsidePolygons: (point, vs) => {
    if (!Array.isArray(point) || point.length < 2 || vs?.length < 2)
      return false;
    var x = point[0];
    var y = point[1];
    var inside = false;
    for (var i = 0, j = vs?.length - 1; i < vs?.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  },
  // getPolygonCentroid: (points) => {
  //   var centroid = [0, 0];
  //   for (var i = 0; i < points.length; i++) {
  //     var point = points[i];
  //     centroid[0] += point[0];
  //     centroid[1] += point[1];
  //   }
  //   centroid[0] /= points.length;
  //   centroid[1] /= points.length;
  //   // console.log(centroid)
  //   return centroid;
  // },
  getPolygonCentroid: (points) => {
    if (!Array.isArray(points) || points.length == 0) return [0, 0];
    var centroid = [0, 0];
    const area = Helpers.calcPolygonArea(points, false);
    for (var i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const P = points[i][0] * points[j][1] - points[i][1] * points[j][0];
      centroid[0] = centroid[0] + (points[i][0] + points[j][0]) * P;
      centroid[1] = centroid[1] + (points[i][1] + points[j][1]) * P;
    }

    centroid[0] = centroid[0] / (6 * area);
    centroid[1] = centroid[1] / (6 * area);

    return centroid;
  },
  calcPolygonArea: (points, absStatus = true) => {
    if (!Array.isArray(points) || points.length == 0) return 0;
    // var total = 0;

    // for (var i = 0, l = points.length; i < l; i++) {
    //   var addX = points[i][0];
    //   var addY = points[i == points.length - 1 ? 0 : i + 1][1];
    //   var subX = points[i == points.length - 1 ? 0 : i + 1][0];
    //   var subY = points[i][1];

    //   total += addX * addY * 0.5;
    //   total -= subX * subY * 0.5;
    // }
    let area = 0;

    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const point = points[i];
      const point2 = points[j];

      area += point[0] * point2[1] - point2[0] * point[1];
    }
    // console.log(area)
    if (!absStatus) {
      return area / 2;
    }
    return Math.abs(area / 2);
  },
  getWallBoundaries: (boundaries) => {
    let bdr = [];
    boundaries.map((boundary, i) => {
      const prevBoundary =
        boundaries[(i - 1 + boundaries.length) % boundaries.length];
      const nextBoundary = boundaries[(i + 1) % boundaries.length];
      const point = new THREE.Vector3(boundary[0], boundary[1], 0);
      const prevPoint = new THREE.Vector3(prevBoundary[0], prevBoundary[1], 0);
      const nextPoint = new THREE.Vector3(nextBoundary[0], nextBoundary[1], 0);
      // const lastPoint = endPoint.clone().sub(startPoint).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(startPoint)
      const vttow = nextPoint.clone().sub(prevPoint);
      const hcvg = point
        .clone()
        .sub(prevPoint)
        .projectOnVector(vttow)
        .add(prevPoint);
      let vttt = hcvg
        .clone()
        .sub(point)
        .setLength(0.38 / 2)
        .negate()
        .add(point);
      if (Helpers.checkPointIsInsidePolygons([vttt.x, vttt.y], boundaries)) {
        vttt = vttt.clone().sub(point).negate().add(point);
      }
      bdr.push([vttt.x, vttt.y]);
    });
    return bdr;
  },
};

export default Helpers;
