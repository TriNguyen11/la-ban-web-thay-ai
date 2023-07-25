import React from "react";

import { extend } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
const {
  useGLTF,
  OrbitControls,
  useTexture,
  PivotControls,
} = require("@react-three/drei");
extend({ TextGeometry, MeshLineGeometry, MeshLineMaterial });

const Roller = React.forwardRef((props, ref) => {
  const length = props.length || 0;
  const width = props.width || 0;
  const startPoint = new THREE.Vector3(-length / 2, 0, 0);
  const endPoint = new THREE.Vector3(length / 2, 0, 0);

  const startPointReverse = new THREE.Vector3(length / 2, 0, 0);
  const endPointReverse = new THREE.Vector3(length, 0, 0);

  // left line

  const startPointLeftHorizontal = new THREE.Vector3(-length / 2, 0.1, 0);
  const endPointLeftHorizontal = new THREE.Vector3(-length / 2 + 0.15, 0.1, 0);
  const endPointLeftVertical = startPointLeftHorizontal
    .clone()
    .sub(startPointLeftHorizontal)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    .add(startPointLeftHorizontal)
    .add(new THREE.Vector3(0, -1, 0));
  // left Mesh
  const verticesMesh3 = [
    [-length / 2.2, -width / 2 - 0.15],
    [-length / 2, -width / 2 - 0.15],
    [-length / 2, -width / 2 - 0.3],
    [-length / 2.2, -width / 2 - 0.3],
  ];
  const verticesMesh4 = [
    [-length / 2.2, -width / 2 - 0.45],
    [-length / 2, -width / 2 - 0.45],
    [-length / 2, -width / 2 - 0.3],
    [-length / 2.2, -width / 2 - 0.3],
  ];
  //right line
  const startPointRightHorizontal = new THREE.Vector3(length / 2, 0.1, 0);
  const endPointRightHorizontal = new THREE.Vector3(length / 2 - 0.15, 0.1, 0);
  const endPointRightVertical = startPointRightHorizontal
    .clone()
    .sub(startPointRightHorizontal)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    .add(startPointRightHorizontal)
    .add(new THREE.Vector3(0, -1, 0));

  // left line
  const lineGeometryLeftHorizontal = new THREE.BufferGeometry().setFromPoints([
    startPointLeftHorizontal,
    endPointLeftHorizontal,
  ]);
  const lineGeometryLeftVertical = new THREE.BufferGeometry().setFromPoints([
    startPointLeftHorizontal,
    endPointLeftVertical,
  ]);
  // right line
  const lineGeometryRightHorizontal = new THREE.BufferGeometry().setFromPoints([
    startPointRightHorizontal,
    endPointRightHorizontal,
  ]);
  const lineGeometryRightVertical = new THREE.BufferGeometry().setFromPoints([
    startPointRightHorizontal,
    endPointRightVertical,
  ]);

  // line center
  const lineGeometryCenter = new THREE.BufferGeometry().setFromPoints([
    startPoint.sub(new THREE.Vector3(-0.05, 0, 0)),
    startPointReverse.sub(new THREE.Vector3(+0.05, 0, 0)),
  ]);
  // mesh center
  const positionCenterMesh = [-0.05, -0.5, 0];
  const verticesMesh5 = [
    [length / 2.5 + 0.025, -width / 2 - 0.25],
    [-length / 2.25 - 0.0225, -width / 2 - 0.25],
    [-length / 2.25 - 0.0225, -width / 2 - 0.35],
    [length / 2.5 + 0.025, -width / 2 - 0.35],
  ];

  // Right Mesh
  const verticesMesh2 = [
    [length / 2.5 + 0.025, -width / 2 - 0.2],
    [length / 2, -width / 2 - 0.2],
    [length / 2, -width / 2 - 0.3],
    [length / 2.5 + 0.025, -width / 2 - 0.3],
  ];
  const verticesMesh1 = [
    [length / 2.5 + 0.025, -width / 2 - 0.4],
    [length / 2, -width / 2 - 0.4],
    [length / 2, -width / 2 - 0.3],
    [length / 2.5 + 0.025, -width / 2 - 0.3],
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
        <planeGeometry attach="geometry" args={[length + 0.1, width]} />
        <meshBasicMaterial
          attach="material"
          color={"#D9D4AD"}
          // transparent
        />
      </mesh>
      {/* line center */}
      <line
        geometry={lineGeometryCenter}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.1}
          gapSize={0.05}
        />
      </line>

      <mesh>
        <shapeGeometry args={[roundedRect(verticesMesh5)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      {verticesMesh5.map((vertice, i) => {
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
                  verticesMesh5[(i + 1) % verticesMesh5.length][0],
                  verticesMesh5[(i + 1) % verticesMesh5.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {/* left */}
      {/* line  */}
      <line geometry={lineGeometryLeftHorizontal}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      <line geometry={lineGeometryLeftVertical}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      {/* mesh */}
      <mesh>
        <shapeGeometry args={[roundedRect(verticesMesh4)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <shapeGeometry args={[roundedRect(verticesMesh3)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      {verticesMesh4.map((vertice, i) => {
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
                  verticesMesh4[(i + 1) % verticesMesh4.length][0],
                  verticesMesh4[(i + 1) % verticesMesh4.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesMesh3.map((vertice, i) => {
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
                  verticesMesh3[(i + 1) % verticesMesh3.length][0],
                  verticesMesh3[(i + 1) % verticesMesh3.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {/* right */}
      {/* line */}
      <line geometry={lineGeometryRightHorizontal}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      <line geometry={lineGeometryRightVertical}>
        <lineBasicMaterial attach="material" color="#000" />
      </line>
      {/* mesh */}
      <mesh>
        <shapeGeometry args={[roundedRect(verticesMesh1)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <shapeGeometry args={[roundedRect(verticesMesh2)]} />
        <meshBasicMaterial
          attach="material"
          color={"#fff"}
          transparent
          sizes={0.3}
          opacity={0.8}
        />
      </mesh>
      {verticesMesh1.map((vertice, i) => {
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
                  verticesMesh1[(i + 1) % verticesMesh1.length][0],
                  verticesMesh1[(i + 1) % verticesMesh1.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {verticesMesh2.map((vertice, i) => {
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
                  verticesMesh2[(i + 1) % verticesMesh2.length][0],
                  verticesMesh2[(i + 1) % verticesMesh2.length][1],
                  0.001
                ),
              ]}
            />
          </mesh>
        );
      })}
      {/* <mesh position={[-length / 2 + width / 4, 0, 0]}>
        <planeGeometry attach="geometry" args={[width / 2, width / 2]} />
        <meshBasicMaterial
          attach="material"
          color={"#000"}
          // transparent
        />
      </mesh> */}
      {/* <mesh position={  ]}>
        <planeGeometry attach="geometry" args={[width / 2, width / 2]} />
        <meshBasicMaterial
          attach="material"
          color={"#000"}
          // transparent
        />
      </mesh> */}
    </>
  );
});

export default Roller;
