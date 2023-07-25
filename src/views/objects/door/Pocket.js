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

const Pocket = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;

  const verticesIn = [
    [-length / 1.65, 0.025],
    [-length / 2.5, 0.025],
    [-length / 2.5, -0.025],
    [-length / 1.65, -0.025],
  ];
  const verticesOut = [
    [-length / 2, 0.035],
    [-length / 1.65 - 0.0125, 0.035],
    [-length / 1.65 - 0.0125, -0.035],
    [-length / 2, -0.035],
  ];

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

      {verticesOut.map((vertice, i) => {
        return (
          <mesh>
            <meshLineMaterial
              transparent
              lineWidth={0.01}
              color={"black"}
              opacity={0.7}
              depthWrite={true}
              toneMapped={true}
            />
            <meshLineGeometry
              points={[
                new THREE.Vector3([vertice[0]], vertice[1], 0.001),
                new THREE.Vector3(
                  verticesOut[
                    (i + 1 === verticesOut.length ? i : i + 1) %
                      verticesOut.length
                  ][0],
                  verticesOut[
                    (i + 1 === verticesOut.length ? i : i + 1) %
                      verticesOut.length
                  ][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesIn.map((vertice, i) => {
        return (
          <mesh>
            <meshLineMaterial
              transparent
              lineWidth={0.005}
              color={"black"}
              opacity={0.7}
              depthWrite={true}
              toneMapped={true}
            />
            <meshLineGeometry
              points={[
                new THREE.Vector3([vertice[0]], vertice[1], 0.001),
                new THREE.Vector3(
                  verticesIn[(i + 1) % verticesIn.length][0],
                  verticesIn[(i + 1) % verticesIn.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
    </>
  );
});

export default Pocket;
