import Notify from "@floorplan/system/messages";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
const eps = 1e-9;

const sign = (x) => {
  if (x > eps) return 1;
  if (x < -eps) return -1;
  return 0;
};
const cross = (AB, AC) => {
  return AB.x * AC.y - AC.x * AB.y;
};
const dot = (AB, AC) => {
  return AB.x * AC.x + AB.y * AC.y;
};
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
    if(!Array.isArray(point) || point.length < 2 || vs?.length < 2) return false
    var x = point[0]
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
    if(!Array.isArray(points) || points.length == 0) return [0, 0]
    var centroid = [0, 0];
    const area = Helpers.calcPolygonArea(points,false)
    for (var i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const P = (points[i][0] * points[j][1]) - (points[i][1] * points[j][0]);
      centroid[0] = centroid[0] + (points[i][0] + points[j][0]) * P;
      centroid[1] = centroid[1] + (points[i][1] + points[j][1]) * P;
    }
    
    centroid[0] = centroid[0] / ( 6 * area);
    centroid[1] = centroid[1] / ( 6 * area);
    
    return centroid;
  },
  calcPolygonArea: (points,absStatus = true) => {
    if(!Array.isArray(points) || points.length == 0) return 0
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

      area += point[0] * point2[1] - point2[0] * point[1]
    }
    // console.log(area)
    if (!absStatus) {
      return area / 2;
    }
    return Math.abs(area / 2);
  },
  getWallBoundaries: (boundaries) => {
    let bdr = []
    boundaries.map((boundary, i) => {
      const prevBoundary = boundaries[(i - 1 + boundaries.length) % boundaries.length]
      const nextBoundary = boundaries[(i + 1) % boundaries.length]
      const point = new THREE.Vector3(boundary[0],boundary[1],0)
      const prevPoint = new THREE.Vector3(prevBoundary[0],prevBoundary[1],0)
      const nextPoint = new THREE.Vector3(nextBoundary[0],nextBoundary[1],0)
      // const lastPoint = endPoint.clone().sub(startPoint).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(startPoint)
      const vttow = nextPoint.clone().sub(prevPoint)
      const hcvg = point.clone().sub(prevPoint).projectOnVector(vttow).add(prevPoint)
      let vttt = hcvg.clone().sub(point).setLength(0.38/2).negate().add(point)
      if(Helpers.checkPointIsInsidePolygons([vttt.x,vttt.y],boundaries)){
        vttt = vttt.clone().sub(point).negate().add(point)
      }
      bdr.push([vttt.x,vttt.y])
    })
    return bdr
  },
  // Tim hinh chieu cua diem a Len duong thang tao boi b va c.
  timHinhChieuCuaDiemLenDuongThangBoi2Diem: (a, b, c) => {
    const vtcp = [c[0] - b[0], c[1] - b[1]];
    const vtpt = [vtcp[1], -vtcp[0]];
    // Puhong trinh duong thang
    // vtpt[0] * x + vtpt[1] * y - vtpt[0] * b[0] - vtpt[1] * b[1] = 0
    // H(a1,b1) La hinh chieu
    // vtpt[0] * a1 + vtpt[1] * b1 - vtpt[0] * b[0] - vtpt[1] * b[1] = 0
    // a1 = (vtpt[0] * b[0] + vtpt[1] * b[1] - vtpt[1] * b1) / vtpt[0]
    // b1 = - (a1 - a[0]) * vtpt[0] / vtpt[1] + a[1]
    const b1 =
      ((vtpt[0] * b[0]) / vtpt[1] + b[1] - (a[0] * vtpt[0]) / vtpt[1] + a[1]) /
      2;

    // const b1 = - vtpt[0] * b[0] / vtpt[1] - vtpt[1] * b[1] / vtpt[1] + b1 * vtpt[1] / vtpt[1] + a[0] * vtpt[0] / vtpt[1] + a[1];
    const a1 = (vtpt[0] * b[0] + vtpt[1] * b[1] - vtpt[1] * b1) / vtpt[0];
    // console.log(b,c)
    if (!b1 || b1 == "-Infinity" || b1 == "Infinity") {
      return a;
    }
    if (!a1 || a1 == "-Infinity" || a1 == "Infinity") {
      return a;
    }

    return [a1, b1];
  },
  getPositionNearbyInBoundary: (boundaryCollection, [x, y]) => {
    let boundary = [];
    let po = [x, y, 0];
    let ro = [0, 0, 0];
    let oldDistance = 100000;
    const point = new THREE.Vector3(x, y, 0);
    for (let i = 0; i < boundaryCollection.length; i++) {
      let boundaries = boundaryCollection[i];
      for (let j = 0; j < boundaries.length; j++) {
        const nextIndex = boundaries[j + 1] ? j + 1 : 0;
        const nextBoundary = boundaries[nextIndex];
        
        
        const pointStart = new THREE.Vector3(
          boundaries[j][0],
          boundaries[j][1],
          0
        );
        const pointEnd = new THREE.Vector3(nextBoundary[0], nextBoundary[1], 0);
        // const distance = point.distanceTo(
        //   new THREE.Vector3(
        //     pointEnd.x - pointStart.x,
        //     pointEnd.y - pointStart.y,
        //     0
        //   )
        // );

        const line = new THREE.Vector3(
          pointEnd.x - pointStart.x,
          pointEnd.y - pointStart.y,
          0
        );
        const newVectorProject = new THREE.Vector3(
          point.x - pointStart.x,
          point.y - pointStart.y,
          0
        ).projectOnVector(line);
        
        const newPosition = newVectorProject.clone().add(
          new THREE.Vector3(pointStart.x, pointStart.y, 0)
        );
        const distance = newPosition.distanceTo(point)
        // console.log(newVectorProject)
        // console.log(point,pointStart)
        if(newVectorProject.x == 0 && newVectorProject.y == 0) return
        if (
          distance < oldDistance &&
          !(
            newPosition.distanceTo(pointStart) > line.length() ||
            newPosition.distanceTo(pointEnd) > line.length()
          )
        ) {
          // console.log(distance,point.x,point.y,pointEnd.x - pointStart.x,pointEnd.y - pointStart.y)
          oldDistance = distance;

          boundary = [
            [pointStart.x, pointStart.y],
            [pointEnd.x, pointEnd.y],
          ];
          po = [newPosition.x, newPosition.y, newPosition.z];
          // ro = [0,0,line.angleTo(new THREE.Vector3(1,0,0))]
          const angle = Helpers.caculateDegreeFromTwoPointFollowYAxis(
            pointEnd.x,
            pointEnd.y,
            po[0],
            po[1]
          );
          // console.log(pointEnd.x,pointEnd.y,po[0],po[1])
          ro = [0, 0, ((angle - 90) * Math.PI) / 180];
        }
      }
    }
    return {
      boundary: boundary,
      position: po,
      rotation: ro,
    };
  },
  caculateDegreeFromTwoPointFollowYAxis: (x, y, a, b) => {
    const R = Math.sqrt(Math.pow(a - x, 2) + Math.pow(b - y, 2));
    if (a - x <= 0 && b - y >= 0) {
      const sina = (x - a) / R;
      return (Math.asin(sina) * 180) / Math.PI;
    } else if (a - x <= 0 && b - y <= 0) {
      const sina = (x - a) / R;
      // console.log(180 - Math.asin(sina) * 180 / Math.PI)
      return 180 - (Math.asin(sina) * 180) / Math.PI;
    } else if (a - x >= 0 && b - y <= 0) {
      const sina = (a - x) / R;
      return 180 + (Math.asin(sina) * 180) / Math.PI;
    } else if (a - x >= 0 && b - y >= 0) {
      const sina = (b - y) / R;
      return 270 + (Math.asin(sina) * 180) / Math.PI;
    } else {
      return 0;
    }
  },
  getBoundaiesParent: (boundaries = [0, 0, 0, 0], distance = 0.5) => {
    let maxX, maxY, minX, minY;
    let arrX = [];
    let arrY = [];

    boundaries.map((item) => {
      arrX.push(item[0]);
      arrY.push(item[1]);
    });
    minX = Math.min(...arrX) - distance;
    maxX = Math.max(...arrX) + distance;
    minY = Math.min(...arrY) - distance;
    maxY = Math.max(...arrY) + distance;
    return { minX, maxX, minY, maxY };
  },
  kiemTraGiaoNhau: (A, B, C, D) => {
    const ABxAC = sign(
      cross(
        {
          x: B.x - A.x,
          y: B.y - A.y,
        },
        { x: C.x - A.x, y: C.y - A.y }
      )
    );
    const ABxAD = sign(
      cross(
        {
          x: B.x - A.x,
          y: B.y - A.y,
        },
        { x: D.x - A.x, y: D.y - A.y }
      )
    );
    const CDxCA = sign(
      cross(
        {
          x: D.x - C.x,
          y: D.y - C.y,
        },
        { x: A.x - C.x, y: A.y - C.y }
      )
    );
    const CDxCB = sign(
      cross(
        {
          x: D.x - C.x,
          y: D.y - C.y,
        },
        { x: B.x - C.x, y: B.y - C.y }
      )
    );
    if (ABxAC == 0 || ABxAD == 0 || CDxCA == 0 || CDxCB == 0) {
      // C on segment AB if ABxAC = 0 and CA.CB <= 0
      if (
        ABxAC == 0 &&
        sign(
          dot(
            {
              x: A.x - C.x,
              y: A.y - C.y,
            },
            { x: B.x - C.x, y: B.y - C.y }
          )
        ) <= 0
      )
        return true;
      if (
        ABxAD == 0 &&
        sign(
          dot(
            {
              x: A.x - D.x,
              y: A.y - D.y,
            },
            { x: B.x - D.x, y: B.y - D.y }
          )
        ) <= 0
      )
        return true;
      if (
        CDxCA == 0 &&
        sign(
          dot(
            {
              x: C.x - A.x,
              y: C.y - A.y,
            },
            { x: D.x - A.x, y: D.y - A.y }
          )
        ) <= 0
      )
        return true;
      if (
        CDxCB == 0 &&
        sign(
          dot(
            {
              x: C.x - B.x,
              y: C.y - B.y,
            },
            { x: D.x - B.x, y: D.y - B.y }
          )
        ) <= 0
      )
        return true;
      return false;
    }
  },
};

export default Helpers;
