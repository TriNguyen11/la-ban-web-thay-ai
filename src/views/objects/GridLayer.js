import React, { useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { Components, APIs, Helper } from "@floorplan/App";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
const { useGLTF, OrbitControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";

function GridLayer(props) {
  const { viewport } = useThree();
  const { factor } = viewport;
  const [drawingStartPosition, setDrawingStartPosition] = React.useState();
  const width = props.width || 100;
  const isDrawing = props.isDrawing || false;
  const [notOnMobile,setNotOnMobile] = React.useState();
  let lastDrag = null
  const bind = useGesture(
    {
      onMoveStart: (data) => {
        //  console.log(data.event.point.x,data.event.point.y,'start')
        setNotOnMobile(true)
        setDrawingStartPosition([data.event.point.x, data.event.point.y]);
      },
      onMove: (data) => {
        // console.log(data.event.point.x,data.event.point.y,'start')
        // props.onDrag({...data})
      },
      onMoveEnd: (data) => {
        // setDrawingStartPosition()
        // props.onDragEnd(data)
        setNotOnMobile(false)
      },
      onDragStart: (data) => {
        // console.log(data.event.point.x,data.event.point.y,'start')
        setDrawingStartPosition([data.event.point.x, data.event.point.y]);
      },
      onDrag: (data) => {
        if (
          !data.active ||
          !Array.isArray(drawingStartPosition) ||
          drawingStartPosition.length != 2
        ) {
          return;
        }
        // console.log(data.offset,drawingStartPosition,'onDrag')
        if (!notOnMobile) {
          // console.log('aaaa')
          data.offset = [data.offset[0] + drawingStartPosition[0],data.offset[1] + drawingStartPosition[1]]
        }
        if (Array.isArray(lastDrag) && lastDrag.length == 2) {
          const point = new THREE.Vector2(data.offset[0],data.offset[1])
          const lastPoint = new THREE.Vector2(lastDrag[0],lastDrag[1])
          if(point.clone().sub(lastPoint).length() >= 0.05){
            props.onDrag({ ...data });
          }
        }else{
          lastDrag = data.offset
        }
        
      },
      onDragEnd: (data) => {
        setDrawingStartPosition();
        props.onDragEnd(data);
      },
    },
    {
      enabled: isDrawing,
      drag: {
        enabled: isDrawing && drawingStartPosition,
        from: () => drawingStartPosition || [0, 0],
      },
      transform: ([x, y]) => [x / factor, -y / factor],
    }
  );
  return (
    <gridHelper
      // args={[width, width, 0xff0000, "#e8e8e8"]}
      args={[width, width, '#e8e8e8', '#e8e8e8']}
      rotation={[Math.PI / 2, 0, 0]}
      {...bind()}
    />
  );
}

export default GridLayer;
