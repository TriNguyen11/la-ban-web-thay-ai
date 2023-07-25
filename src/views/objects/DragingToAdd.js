import React, { useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { Components, APIs, Helper } from "@floorplan/App";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
const { useGLTF, OrbitControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import Room from "@floorplan/views/objects/Room";
import Floorplan from "@floorplan/views/objects/Floorplan";
import Door from "@floorplan/views/objects/Door";

const DragingToAdd = React.forwardRef((props, ref) => {
  const boundaryCollection = props.boundaryCollection || [];
  const boundaryWallCollection = props.boundaryWallCollection || [];
  const objRef = React.useRef();
  const [info, setInfo] = React.useState({});
  const { size, viewport, camera } = useThree();
  const aspect = size.width / viewport.width;
  // Use this from another hook.
  React.useImperativeHandle(ref, () => ({
    set: (data) => {
      if (
        objRef &&
        objRef.current &&
        Array.isArray(data.position) &&
        data.position.length == 3
      ) {
        // console.log(data.position[0] / aspect,- data.position[1] / aspect,camera.position)
        // console.log(viewport.width)
        data.position = [
          data.position[0] / aspect + camera.position.x + viewport.width / 2,
          -data.position[1] / aspect + camera.position.y,
          0,
        ];

        if (data.type == "room") {
          let boundaries = [...data.boundaries];
          for (let i = 0; i < boundaries.length; i++) {
            boundaries[i] = [
              boundaries[i][0] + data.position[0],
              boundaries[i][1] + data.position[1],
            ];
          }
          data.boundaries = boundaries;
          objRef.current.setBoundaries(boundaries);
        } else if (data.type == "door") {
          const pon = Helper.getPositionNearbyInBoundary(
            boundaryWallCollection,
            data.position
          );
          data.position = pon.position;
          data.rotation = pon.rotation;
          objRef.current.setBoundary(data.boundary);
          objRef.current.setPosition(data.position);
          objRef.current.setRotation(data.rotation);
        } else {
          data.boundaries = [
            [
              data.position[0] - data.length / 2,
              data.position[1] + data.width / 2,
            ],
            [
              data.position[0] + data.length / 2,
              data.position[1] + data.width / 2,
            ],
            [
              data.position[0] + data.length / 2,
              data.position[1] - data.width / 2,
            ],
            [
              data.position[0] - data.length / 2,
              data.position[1] - data.width / 2,
            ],
          ];
          objRef.current.setPosition(data.position);
        }
      }
      props.onChange(data);
      setInfo(data);
    },
    get: () => {
      return info;
    },
  }));
  if (info.position) {
    // console.log(info.rotation,'aaa')
    if (info.type == "room") {
      return <FakeRoom ref={objRef} info={info} />;
    }
    if (info.type == "door") {
      return <Door ref={objRef} info={info} />;
    }
    return <Floorplan ref={objRef} info={info} />;
  }
  return <></>;
});

const FakeRoom = React.forwardRef((props, ref) => {
  const info = props.info || {};
  const [position, setPosition] = React.useState(info.position);
  const [boundaries, setBoundaries] = React.useState(info.boundaries || []);
  function roundedRect() {
    const shape = new THREE.Shape();
    shape.moveTo(boundaries[0][0], boundaries[0][1]);
    boundaries.map((item) => {
      shape.lineTo(item[0], item[1]);
    });

    return shape;
  }
  // console.log(boundaries)
  React.useImperativeHandle(ref, () => ({
    setPosition: setPosition,
    setBoundaries: setBoundaries,
  }));
  // console.log(position)
  if (!Array.isArray(position) || position.length != 3) {
    return <></>;
  }
  return (
    <mesh>
      <shapeGeometry args={[roundedRect()]} />
      <meshBasicMaterial
        attach="material"
        color={"#d9d4ad"}
        transparent
        sizes={0.3}
        opacity={0.8}
      />
    </mesh>
  );
});

export default DragingToAdd;
