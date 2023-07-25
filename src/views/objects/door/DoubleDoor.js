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

const Door = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;

  const startPoint = new THREE.Vector3(-length / 2, 0, 0);
  const endPoint = new THREE.Vector3(length / 2, 0, 0);

  const lastOpenDoorPoint = endPoint
    .clone()
    // .sub(startPoint)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    .add(startPoint);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    lastOpenDoorPoint,
  ]);

  const startPoint2 = startPoint
    .clone()
    .sub(new THREE.Vector3(-width / 4, 0.005, 0));
  const lastOpenDoorPoint2 = lastOpenDoorPoint
    .clone()
    .sub(new THREE.Vector3(-width / 4, 0.005, 0));
  const lineGeometry2 = new THREE.BufferGeometry().setFromPoints([
    startPoint2,
    lastOpenDoorPoint2,
  ]);

  // reverse
  const startPointReverse = new THREE.Vector3(length / 2, 0, 0);
  const lastOpenDoorPointReverse = endPoint
    .clone()
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
    .add(startPointReverse);

  const lineGeometryReverse = new THREE.BufferGeometry().setFromPoints([
    startPointReverse,
    lastOpenDoorPointReverse,
  ]);
  // console.log(length, "lastOpenDoorPointReverse");
  const lastOpenDoorPoint2_Reverse = lastOpenDoorPointReverse
    .clone()
    .sub(new THREE.Vector3(width / 4, 0.005, 0));

  const startPoint2Reverse = startPointReverse
    .clone()
    .sub(new THREE.Vector3(width / 4, 0.005, 0));

  const lineGeometry2_Reverse = new THREE.BufferGeometry().setFromPoints([
    startPoint2Reverse,
    lastOpenDoorPoint2_Reverse,
  ]);
  // line center
  const lineGeometryCenter = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    startPointReverse,
  ]);

  let verticesRound = [];
  let verticesRoundReverse = [];
  for (var i = 0; i <= 180; i++) {
    var theta = (i / 360) * Math.PI;
    verticesRound.push(
      new THREE.Vector3(
        (Math.cos(theta) / 2) * length - length / 2,
        (Math.sin(theta) / 2) * length,
        0
      )
    );
    verticesRoundReverse.push(
      new THREE.Vector3(
        -((Math.cos(theta) / 2) * length - length / 2),
        -((Math.sin(theta) / 2) * -length),
        0
      )
    );
  }
  const lineGeometry4 = new THREE.BufferGeometry().setFromPoints(verticesRound);
  const lineGeometry5 = new THREE.BufferGeometry().setFromPoints(
    verticesRoundReverse
  );

  return (
    <>
      <mesh>
        <planeGeometry attach="geometry" args={[length, width]} />
        <meshBasicMaterial
          attach="material"
          color={"#D9D4AD"}
          // transparent
        />
      </mesh>
      {/* dot */}
      <mesh position={[-length / 2 + width / 4, 0, 0]}>
        <planeGeometry attach="geometry" args={[width / 2, width / 2]} />
        <meshBasicMaterial
          attach="material"
          color={"#000"}
          // transparent
        />
      </mesh>
      <mesh position={[length / 2 - width / 4, 0, 0]}>
        <planeGeometry attach="geometry" args={[width / 2, width / 2]} />
        <meshBasicMaterial
          attach="material"
          color={"#000"}
          // transparent
        />
      </mesh>
      {/* line border */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      <line geometry={lineGeometry2}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      {/* line center */}
      <line geometry={lineGeometryCenter}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>

      {/* reverse */}
      <line geometry={lineGeometryReverse}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      <line geometry={lineGeometry2_Reverse}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      {/* circle */}
      <line geometry={lineGeometry4}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      <line geometry={lineGeometry5}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
    </>
  );
});

export default Door;
