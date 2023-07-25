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

const SlidingDoor1 = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;

  const vertices = [
    // Tren
    [
      new THREE.Vector3(-length / 2, -width / 2, 0.01),
      new THREE.Vector3(length / 2, -width / 2, 0.01),
    ],
    // Phai
    [
      new THREE.Vector3(length / 2, -width / 2, 0.01),
      new THREE.Vector3(length / 2, width / 2, 0.01),
    ],
    // Duoi
    [
      new THREE.Vector3(length / 2, width / 2, 0.01),
      new THREE.Vector3(-length / 2, width / 2, 0.01),
    ],
    // Trai
    [
      new THREE.Vector3(-length / 2, width / 2, 0.01),
      new THREE.Vector3(-length / 2, -width / 2, 0.01),
    ],
  ];
  const verticesFrame = [
    [-length / 2, width / 2],
    [length / 2, width / 2],
    [length / 2, -width / 2],
    [-length / 2, -width / 2],
  ];
  const verticesLong = [
    [-length / 1.5, -width / 2],
    [length, -width / 2],
    [length, -width / 2 - 0.05],
    [-length / 1.5, -width / 2 - 0.05],
  ];
  const verticesShort = [
    [length / 2.5, -width / 2 - 0.1],
    [length, -width / 2 - 0.1],
    [length, -width / 2 - 0.25],
    [length / 2.5, -width / 2 - 0.25],
  ];
  function roundedRect(vector) {
    const shape = new THREE.Shape();
    shape.moveTo(vector[0][0], vector[0][1]);
    vector.map((item) => {
      shape.lineTo(item[0], item[1]);
    });
    return shape;
  }
  return (
    <>
      <mesh>
        <shapeGeometry args={[roundedRect(verticesFrame)]} />
        <meshBasicMaterial
          attach="material"
          color={"#D9D4AD"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <shapeGeometry args={[roundedRect(verticesLong)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      {verticesLong.map((vertice, i) => {
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
                  verticesLong[(i + 1) % verticesLong.length][0],
                  verticesLong[(i + 1) % verticesLong.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      <mesh>
        <shapeGeometry args={[roundedRect(verticesShort)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      {verticesShort.map((vertice, i) => {
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
                  verticesShort[(i + 1) % verticesShort.length][0],
                  verticesShort[(i + 1) % verticesShort.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {/* [length / 2.5, -width / 2 - 0.1],
    [length, -width / 2 - 0.1],
    [length, -width / 2 - 0.25],
    [length / 2.5, -width / 2 - 0.25], */}

      {/* [-length / 1.5, -width / 2],
    [length, -width / 2],
    [length, -width / 2 - 0.05],
    [-length / 1.5, -width / 2 - 0.05], */}
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
            new THREE.Vector3(length / 2, -0.2375),
            new THREE.Vector3(length / 2, -width / 2 - 0.1, 0.001),
          ]}
        />
      </mesh>
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
            new THREE.Vector3(length / 1.125, -0.2375),
            new THREE.Vector3(length / 1.125, -width / 2 - 0.1, 0.001),
          ]}
        />
      </mesh>
    </>
  );
});

export default SlidingDoor1;
