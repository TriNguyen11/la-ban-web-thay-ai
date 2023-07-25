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

const Folding = React.forwardRef((props, ref) => {
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

  const verticesLeft = [
    [-length / 2, 0.05],
    [-length / 2 + 0.075, 0.05],
    [-length / 2 + 0.075, -0.05],
    [-length / 2, -0.05],
  ];
  const verticesRight = [
    [length / 2, 0.05],
    [length / 2 - 0.075, 0.05],
    [length / 2 - 0.075, -0.05],
    [length / 2, -0.05],
  ];
  const verticesUp = [
    [-length / 2 + 0.075, 0.05],
    [
      -length / 2 + 0.05,
      length / 15 > 0.05 ? 0.125 : Math.abs(length / 15 + 0.05),
    ],
    [-0.075, length / 5 + 0.025],
    [-0.05, Math.abs(length / 5 - (length / 15 > 0.05 ? 0.05 : 0.0125))],
  ];
  const verticesDown = [
    [-0.05, Math.abs(length / 5 - (length / 15 > 0.05 ? 0.05 : 0.0125))],
    [-0.025, length / 5 + 0.025],
    [
      length / 15 > 0.05 ? length / 2 - 0.25 : 0.15,
      length / 15 > 0.05 ? 0.125 : Math.abs(length / 10 + 0.0125),
    ],
    [
      length / 15 > 0.05 ? length / 2 - 0.275 : 0.125,
      length / 15 > 0.05 ? 0.045 : 0.005,
    ],
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
      {verticesFrame.map((vertice, i) => {
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
      })}
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
      {verticesUp.map((vertice, i) => {
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
                  verticesUp[(i + 1) % verticesUp.length][0],
                  verticesUp[(i + 1) % verticesUp.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesDown.map((vertice, i) => {
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
                  verticesDown[(i + 1) % verticesDown.length][0],
                  verticesDown[(i + 1) % verticesDown.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {/* <mesh>
        <shapeGeometry args={[roundedRect(verticesLeft)]} />
        <meshBasicMaterial
          attach="material"
          color={"#D9D4AD"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh> */}
      {/* {verticesLeft.map((vertice, i) => {
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
        {verticesUp.map((vertice, i) => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(
            vertice
          );
          return (
            <line geometry={lineGeometry} key={i}>
              <lineBasicMaterial attach="material" color="#000" />
            </line>
          );
        })} */}
      {/* {verticesDown.map((vertice, i) => {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(
            vertice
          );
          return (
            <line geometry={lineGeometry} key={i}>
              <lineBasicMaterial attach="material" color="#000" />
            </line>
          );
        })} */}
    </>
  );
});

export default Folding;
