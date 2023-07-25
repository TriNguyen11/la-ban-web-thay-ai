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

const DoubleFolding = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;
  const verticesFrame = [
    [-length / 2, width / 2],
    [length / 2, width / 2],
    [length / 2, -width / 2],
    [-length / 2, -width / 2],
  ];

  function roundedRect(vector) {
    const shape = new THREE.Shape();
    shape.moveTo(vector[0][0], vector[0][1]);
    vector.map((item) => {
      shape.lineTo(item[0], item[1]);
    });
    return shape;
  }
  //  Left
  const verticesLeft = [
    [-length / 2, 0.05],
    [-length / 2 + 0.075, 0.05],
    [-length / 2 + 0.075, -0.05],
    [-length / 2, -0.05],
  ];
  const verticesUp1 = [
    // [-length / 2 + 0.075, 0.05],
    // [
    //   -length / 2 + 0.05,
    //   length / 15 > 0.04 ? 0.125 : Math.abs(length / 15 + 0.05),
    // ],
    // [-length / 3.5, length / 8],
    // [-length / 3.5 + 0.025, length / 15 > 0.04 ? length / 8 - 0.075 : 0.5],
    [-length / 2 + 0.075, 0.05],
    [-length / 2 + 0.05, 0.125],
    [-length / 3.5, length / 8 + 0.075],
    [-length / 3.5 + 0.025, length / 8],
  ];

  const verticesDown1 = [
    // [-length / 3.5 + 0.025, length / 15 > 0.04 ? length / 8 - 0.075 : 0.5],
    // [-length / 3.5 + 0.05, length / 15 > 0.04 ? length / 8 : 0.5],
    // [
    //   length / 15 > 0.04 ? -length / 8 + 0.15 : 0.15,
    //   length / 15 > 0.04 ? 0.125 : Math.abs(length / 10 + 0.0125),
    // ],
    // [
    //   length / 15 > 0.04 ? -length / 8 + 0.12 : 0.125,
    //   length / 15 > 0.04 ? 0.05 : 0.005,
    // ],
    [-length / 3.5 + 0.025, length / 8],
    [-length / 3.5 + 0.05, length / 8 + 0.075],
    [-length / 8 + 0.075, 0.125],
    [-length / 8 + 0.05, 0.05],
  ];
  // Right
  const verticesRight = [
    [length / 2, 0.05],
    [length / 2 - 0.075, 0.05],
    [length / 2 - 0.075, -0.05],
    [length / 2, -0.05],
  ];
  const verticesUp2 = [
    [length / 2 - 0.075 < 0.3 ? length / 2.5 : length / 2 - 0.075, 0.05],
    [length / 2 - 0.05, 0.125],
    [length / 3.5, length / 8 + 0.075],
    [length / 3.5 - 0.025, length / 8],
  ];

  const verticesDown2 = [
    [length / 3.5 - 0.025, length / 8],
    [length / 3.5 - 0.05, length / 8 + 0.075],
    [length / 8 - 0.075, 0.125],
    [length / 8 - 0.05, 0.05],
  ];
  return (
    <>
      {/* <mesh>
        <planeGeometry attach="geometry" args={[length, width]} />
        <meshBasicMaterial attach="material" color={"#D9D4AD"} />
      </mesh> */}
      {/* Frame */}
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
      {/* {verticesFrame.map((vertice, i) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3([vertice[0]], vertice[1], 0),
          new THREE.Vector3(
            verticesFrame[(i + 1) % verticesFrame.length][0],
            verticesFrame[(i + 1) % verticesFrame.length][1],
            0
          ),
        ]);
        return (
          <line geometry={lineGeometry} key={i}>
            <lineBasicMaterial attach="material" color="#000" />
          </line>
        );
      })} */}
      {verticesLeft.map((vertice, i) => {
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
                  verticesLeft[(i + 1) % verticesLeft.length][0],
                  verticesLeft[(i + 1) % verticesLeft.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesRight.map((vertice, i) => {
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
                  verticesRight[(i + 1) % verticesRight.length][0],
                  verticesRight[(i + 1) % verticesRight.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesUp1.map((vertice, i) => {
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
                  verticesUp1[(i + 1) % verticesUp1.length][0],
                  verticesUp1[(i + 1) % verticesUp1.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesDown1.map((vertice, i) => {
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
                  verticesDown1[(i + 1) % verticesDown1.length][0],
                  verticesDown1[(i + 1) % verticesDown1.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>

          // <line geometry={lineGeometry} key={i}>
          //   <lineBasicMaterial attach="material" color="#000" linewidth={1} />
          // </line>
        );
      })}
      {verticesUp2.map((vertice, i) => {
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
                  verticesUp2[(i + 1) % verticesUp2.length][0],
                  verticesUp2[(i + 1) % verticesUp2.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesDown2.map((vertice, i) => {
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
                  verticesDown2[(i + 1) % verticesDown2.length][0],
                  verticesDown2[(i + 1) % verticesDown2.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
          // <line geometry={lineGeometry} key={i}>
          //   <lineBasicMaterial attach="material" color="#000" linewidth={1} />
          // </line>
        );
      })}
    </>
  );
});

export default DoubleFolding;
