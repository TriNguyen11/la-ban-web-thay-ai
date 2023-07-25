import React, { useRef, useState, useEffect, Suspense } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { Components, APIs, Helper, Notify } from "@floorplan/App";

import * as THREE from "three";
import { Canvas, useFrame, useThree, events } from "@react-three/fiber";
const {
  useGLTF,
  OrbitControls,
  CameraControls,
  PerspectiveCamera,
} = require("@react-three/drei");
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";

import SideBar from "./common/SideBar";
import TopBar from "./common/TopBar";
import TopBarFloor from "./common/TopBarFloor";
import BottomBar from "./common/BottomBar";
import BottomBarFloor from "./common/BottomBarFloor";
import Room from "@floorplan/views/objects/Room";
import Wall from "@floorplan/views/objects/Wall";
import Floorplan from "@floorplan/views/objects/Floorplan";
import Door from "@floorplan/views/objects/Door";
import GridLayer from "@floorplan/views/objects/GridLayer";
import Drawing from "@floorplan/views/objects/Drawing";
import Draging from "@floorplan/views/objects/Draging";
import DragingToAdd from "@floorplan/views/objects/DragingToAdd";
import Rulers from "@floorplan/views/objects/Rulers";
import BoundaryParent from "./objects/BoundaryParent";
import ThuocDoPhanCung from "./objects/ThuocDoPhanCung";

const eventManagerFactory = (state) => ({
  // Default configuration
  ...events(state),

  // Determines if the event layer is active
  enabled: true,

  // Event layer priority, higher prioritized layers come first and may stop(-propagate) lower layer
  priority: 0,

  // The filter can re-order or re-structure the intersections
  filter: (items, state = null) => items,

  // The compute defines how pointer events are translated into the raycaster and pointer vector2
  compute: (event, state, previous = null) => {
    console.log(event.pointerType);
    // state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1)
    // state.raycaster.setFromCamera(state.pointer, state.camera)
  },

  // Find more configuration default on ./packages/fiber/src/web/events.ts
  // And type definitions in ./packages/fiber/src/core/events.ts
});

const maxGrid = 1000;
const ProjectEditor = React.forwardRef((props, ref) => {
  return (
    <>
      <div>asd</div>
    </>
  );
});

export default ProjectEditor;
