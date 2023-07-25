import React, { useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import * as THREE from "three";
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
const {
  useGLTF,
  OrbitControls,
  useTexture,
  PivotControls,
} = require("@react-three/drei");
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import Roboto from "@floorplan/fonts/Roboto_Regular.json";
extend({ TextGeometry, MeshLineGeometry, MeshLineMaterial });

import { Components, APIs, Helper } from "@floorplan/App";

const Garage = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;
  const startPoint = new THREE.Vector3(-length / 2, 0, 0);
  const endPoint = new THREE.Vector3(length / 2, 0, 0);
  const endPointReverse = new THREE.Vector3(length, 0, 0);

  const lastOpenDoorPoint = endPoint
    .clone()
    .sub(startPoint)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    .add(startPoint);

  const startPointReverse = new THREE.Vector3(length / 2, 0, 0);
  const lastOpenDoorPointReverse = endPointReverse
    .clone()
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    .add(startPointReverse);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    lastOpenDoorPoint,
  ]);
  const lineGeometryTop = new THREE.BufferGeometry().setFromPoints([
    lastOpenDoorPoint,
    lastOpenDoorPointReverse,
  ]);
  const lineGeometryRight = new THREE.BufferGeometry().setFromPoints([
    lastOpenDoorPointReverse,
    startPointReverse,
  ]);
  const lineGeometryBottom = new THREE.BufferGeometry().setFromPoints([
    startPointReverse,
    startPoint,
  ]);
  // cross
  const lineGeometryCorss1 = new THREE.BufferGeometry().setFromPoints([
    lastOpenDoorPoint,
    startPointReverse,
  ]);
  const lineGeometryCorss2 = new THREE.BufferGeometry().setFromPoints([
    lastOpenDoorPointReverse,
    startPoint,
  ]);
  return (
    <>
      {/* background */}
      <mesh>
        <planeGeometry attach="geometry" args={[length, width]} />
        <meshBasicMaterial
          attach="material"
          color={"#989891"}
          // transparent
        />
      </mesh>
      {/* left */}
      <line
        geometry={lineGeometry}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>
      {/* top */}
      <line
        geometry={lineGeometryTop}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>
      {/* right */}
      <line
        geometry={lineGeometryRight}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>
      {/* bottom */}
      <line
        geometry={lineGeometryBottom}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>
      {/* Cross */}
      <line
        geometry={lineGeometryCorss1}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>
      <line
        geometry={lineGeometryCorss2}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}

          // linewidth={10}
        />
      </line>
    </>
  );
});

export default Garage;
