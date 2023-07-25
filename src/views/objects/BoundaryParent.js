import React, { useState } from "react";

const { useGLTF, OrbitControls } = require("@react-three/drei");
import { Components, APIs, Helper,Notify } from "@floorplan/App";

import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import Helpers from "@floorplan/helper";
import Wall from "./Wall";
import Dot from "./Dot";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import Roboto from "@floorplan/fonts/Roboto_Regular.json";
import { Vector3 } from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
extend({ TextGeometry, MeshLineGeometry, MeshLineMaterial });
const BoundaryParent = React.forwardRef((props, ref) => {
  const boundaryCollection = props.boundaryCollection || []
  const [boundaryParent, setBoundaryParent] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });
  const [lineDistance, setLineDistance] = useState([]);
  const [arrX, setArrX] = useState([]);
  const [arrY, setArrY] = useState([]);
  // Use this from another hook.
  React.useImperativeHandle(ref, () => ({
    set: (data) => {
      // console.log(data, "boundaryParent");
      // let { boundaries, boundariesBefore } = data;
      // boundariesBefore = boundaryCollection.filter(
      //   (item) => boundariesBefore !== item
      // );
      // const a = Helper.getBoundaiesParent(
      //   [...boundariesBefore, boundaries].flat(1),
      //   2
      // )
      // setBoundaryParent(a);
    },
    setLineDistance: (data) => {
      let vector = [];
      let arrX = [];
      let arrY = [];
      if (data.boundaryCollection) {
        let boundariesTotal = data.boundaryCollection.flat(1);
        boundariesTotal.map((item, index) => {
          const objBoundariesItem = {
            x: item[0],
            y: item[1],
          };
          const PointMinXMinY = {
            x: item[0],
            y: boundaryParent.minY,
          };
          const PointMinXMaxY = {
            x: item[0],
            y: boundaryParent.maxY,
          };
          const PointMaxXMinY = {
            x: boundaryParent.minX,
            y: item[1],
          };
          const PointMaxXMaxY = {
            x: boundaryParent.maxX,
            y: item[1],
          };
          arrX.push(item[0]);
          arrY.push(item[1]);
          const arrPointMinMax = [
            PointMinXMinY,
            PointMinXMaxY,
            PointMaxXMinY,
            PointMaxXMaxY,
          ];
          arrPointMinMax.forEach((pointChild, i) => {
            boundariesTotal.map((itemChild, indexChild) => {
              const point1 = {
                x: itemChild[0],
                y: itemChild[1],
              };
              const point2 = {
                x: boundariesTotal[
                  (indexChild + 1) % boundariesTotal.length
                ][0],
                y: boundariesTotal[
                  (indexChild + 1) % boundariesTotal.length
                ][1],
              };

              if (
                Helper.kiemTraGiaoNhau(
                  objBoundariesItem,
                  pointChild,
                  point1,
                  point2
                ) === true
              ) {
                // console.log(indexChild, "indexChild");
                // console.log(objBoundariesItem, "objBoundariesItem");
                // console.log(pointChild, "pointChild");
                // console.log(point1, "point1");
                // console.log(point2, "point2");
                // console.log(
                //   Helper.kiemTraGiaoNhau(
                //     objBoundariesItem,
                //     pointChild,
                //     point1,
                //     point2
                //   ),
                //   "check co true hay kh"
                // );
                // console.log("\n\n\n\n\n\n\n");
                if (Math.abs(pointChild.x - item[0]) < 0.1) {
                  vector.push([
                    new THREE.Vector3(pointChild.x - 0.01, pointChild.y, 0),
                    new THREE.Vector3(pointChild.x + 0.01, pointChild.y, 0),
                  ]);
                  // vector = [
                  //   new THREE.Vector3(item[0], pointChild.y - 0.1, 0),
                  //   new THREE.Vector3(item[0], pointChild.y + 0.1, 0),
                  // ];
                }
                if (Math.abs(pointChild.y - item[1]) < 0.1) {
                  vector.push([
                    new THREE.Vector3(pointChild.x, pointChild.y - 0.01, 0),
                    new THREE.Vector3(pointChild.x, pointChild.y + 0.01, 0),
                  ]);
                  // vector = [
                  //   new THREE.Vector3(pointChild.x - 0.1, item[1], 0),
                  //   new THREE.Vector3(pointChild.x + 0.1, item[1], 0),
                  // ];
                }
              }
            });
          });
        });

        setLineDistance(vector);
        // arrminX = new Array(new Set(arrminX));
        // console.log(arrX, "arrX");
        // console.log(arrY, "arrY");
        setArrX(arrX);
        setArrY(arrY);
      }
    },
    get: () => {
      return boundaryParent;
    },
  }));
  // const boundaries = boundaries || [];
  // const area = Helpers.calcPolygonArea(boundaries).toFixed(2);
  // console.log(boundaryParent, "boundaryParentboundaryParent");
  const verticesUp = [
    new THREE.Vector3(boundaryParent.minX || 0, boundaryParent.maxY || 0, 0),
    new THREE.Vector3(boundaryParent.maxX || 0, boundaryParent.maxY || 0, 0),
  ];
  const verticesDown = [
    new THREE.Vector3(boundaryParent.minX || 0, boundaryParent.minY || 0, 0),
    new THREE.Vector3(boundaryParent.maxX || 0, boundaryParent.minY || 0, 0),
  ];
  const verticesLeft = [
    new THREE.Vector3(boundaryParent.minX || 0, boundaryParent.maxY || 0, 0),
    new THREE.Vector3(boundaryParent.minX || 0, boundaryParent.minY || 0, 0),
  ];
  const verticesRight = [
    new THREE.Vector3(boundaryParent.maxX || 0, boundaryParent.maxY || 0, 0),
    new THREE.Vector3(boundaryParent.maxX || 0, boundaryParent.minY || 0, 0),
  ];
  const lineGeometryLeft = new THREE.BufferGeometry().setFromPoints(
    verticesLeft
  );
  const lineGeometryDown = new THREE.BufferGeometry().setFromPoints(
    verticesDown
  );
  const lineGeometryUp = new THREE.BufferGeometry().setFromPoints(verticesUp);
  const lineGeometryRight = new THREE.BufferGeometry().setFromPoints(
    verticesRight
  );
  const font = new FontLoader().parse(Roboto);

  return (
    <>
      {lineDistance.map((item, index) => {
        return (
          <>
            <mesh>
              <meshLineGeometry points={item} />
              <meshLineMaterial
                transparent
                lineWidth={1}
                color={"black"}
                opacity={0.7}
                depthWrite={true}
                toneMapped={true}
              />
            </mesh>
          </>
        );
      })}
      {[boundaryParent.minY, boundaryParent.maxY].map((item) => {
        return arrX.map((itemX, index) => {
          const nextPoint = arrX[(index + 1) % arrX.length];

          return (
            <mesh>
              <meshLineGeometry
                points={[
                  new THREE.Vector3(itemX, item, 0),
                  new THREE.Vector3(nextPoint, item, 0),
                ]}
              />
              <mesh position={[(itemX + nextPoint) / 2, item, 0]}>
                <textGeometry
                  args={[
                    Math.sqrt((nextPoint - itemX) * (nextPoint - itemX))
                      ? Math.sqrt(
                          (nextPoint - itemX) * (nextPoint - itemX)
                        ).toFixed(2) + " "
                      : "",
                    { font, size: 0.5, height: 0.05 },
                  ]}
                />
                <meshPhongMaterial attach="material" color={"#000"} />
              </mesh>
              <meshLineMaterial
                transparent
                lineWidth={0.05}
                color={"black"}
                opacity={0.7}
                depthWrite={true}
                toneMapped={true}
              />
            </mesh>
          );
        });
      })}
      {[boundaryParent.minX, boundaryParent.maxX].map((item) => {
        return arrY.map((itemY, index) => {
          const nextPoint = arrY[(index + 1) % arrY.length];

          return (
            <mesh>
              <meshLineGeometry
                points={[
                  new THREE.Vector3(item, nextPoint, 0),
                  new THREE.Vector3(item, itemY, 0),
                ]}
              />
              <mesh position={[item, (itemY + nextPoint) / 2, 0]}>
                <textGeometry
                  args={[
                    Math.sqrt((nextPoint - itemY) * (nextPoint - itemY)) > 0
                      ? Math.sqrt(
                          (nextPoint - itemY) * (nextPoint - itemY)
                        ).toFixed(2) + " "
                      : "",
                    { font, size: 0.5, height: 0.05 },
                  ]}
                />
                <meshPhongMaterial attach="material" color={"#000"} />
              </mesh>
              <meshLineMaterial
                transparent
                lineWidth={0.05}
                color={"black"}
                opacity={0.7}
                depthWrite={true}
                toneMapped={true}
              />
            </mesh>
          );
        });
      })}
      <line
        geometry={lineGeometryLeft}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.2}
          gapSize={0.2}
        />
      </line>
      <line
        geometry={lineGeometryDown}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.2}
          gapSize={0.2}
        />
      </line>
      <line
        geometry={lineGeometryUp}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.2}
          gapSize={0.2}
        />
      </line>
      <line
        geometry={lineGeometryRight}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.2}
          gapSize={0.2}
        />
      </line>
    </>
  );
});

export default BoundaryParent;
