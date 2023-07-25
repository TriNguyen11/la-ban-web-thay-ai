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

const SlidingDoor = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;

  const verticesLeft = [
    // Tren
    [
      new THREE.Vector3(-length / 2, 0.05, 0.01),
      new THREE.Vector3(0.1, 0.05, 0.01),
    ],
    // Phai
    [new THREE.Vector3(0.1, 0.05, 0.01), new THREE.Vector3(0.1, 0, 0.01)],
    // Duoi
    [new THREE.Vector3(0.1, 0, 0.01), new THREE.Vector3(-length / 2, 0, 0.01)],
    // Trai
    [
      new THREE.Vector3(-length / 2, 0.05, 0.01),
      new THREE.Vector3(-length / 2, 0, 0.01),
    ],
  ];

  const verticesRight = [
    // Tren
    [new THREE.Vector3(length / 2, 0, 0.01), new THREE.Vector3(-0.1, 0, 0.01)],
    // Phai
    [
      new THREE.Vector3(length / 2, -0.05, 0.01),
      new THREE.Vector3(length / 2, 0, 0.01),
    ],
    // Duoi
    [
      new THREE.Vector3(-0.1, -0.05, 0.01),
      new THREE.Vector3(length / 2, -0.05, 0.01),
    ],
    // Trai
    [new THREE.Vector3(-0.1, -0.05, 0.01), new THREE.Vector3(-0.1, 0, 0.01)],
  ];

  return (
    <>
      <mesh>
        <planeGeometry attach="geometry" args={[length, width]} />
        <meshBasicMaterial attach="material" color={"#D9D4AD"} />
      </mesh>
      <mesh>
        {verticesLeft.map((vertice, i) => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(
            vertice
          );
          return (
            <line geometry={lineGeometry} key={i}>
              <lineBasicMaterial attach="material" color="#000" />
            </line>
          );
        })}
        {verticesRight.map((vertice, i) => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(
            vertice
          );
          return (
            <line geometry={lineGeometry} key={i}>
              <lineBasicMaterial attach="material" color="#000" />
            </line>
          );
        })}
      </mesh>
    </>
  );
});

export default SlidingDoor;
