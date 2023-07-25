import React, { useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import * as THREE from 'three'
import { Canvas, useFrame,useThree,useLoader,extend } from '@react-three/fiber'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
const { useGLTF, OrbitControls,useTexture,PivotControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import Roboto from "@floorplan/fonts/Roboto_Regular.json"
extend({TextGeometry,MeshLineGeometry, MeshLineMaterial});

import Apps,{ Components, APIs, Helper, Objects } from "@floorplan/App";

import Dot from './Dot'
const RulerDistance = 0.5

const Door = React.forwardRef((props, ref) => {
  const priority = 3
  const boundaryWallCollection = props.boundaryWallCollection || []
  const info = props.info || {}
  const [boundary, setBoundary] = React.useState(info.boundary || [])
  const [position, setPosition] = React.useState(info.position || [0,0,0])
  const [rotation, setRotation] = React.useState(info.rotation || [0,0,0])
  const enable3D = props.enable3D || false
  const [length, setLength] = React.useState(info.length)
  const [width, setWidth] = React.useState(info.width)
  const [height, setHeight] = React.useState(info.height)
  const { viewport } = useThree()
  const { factor } = viewport;
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDraging, setIsDraging] = React.useState(false);
  const active = props.active || false
  const lock = info.lock || false;
  React.useEffect(() => {
    const ifo = props.info || {}
    setPosition(ifo.position)
    setRotation(ifo.rotation)
    setLength(ifo.length)
    setWidth(ifo.width)
    setHeight(ifo.height)
  },[props.info])
  
  React.useImperativeHandle(ref, () => ({
    priority: priority,
    setPosition: (po) => {
      setPosition(po)
    },
    setRotation: setRotation,
    setBoundary: setBoundary
  }))
  
  const bind = useGesture({
    onDragStart: () => {
      setIsDraging(true)
      if (props.onDragStart) props.onDragStart()
    },
    onDrag: ({active,offset: [x, y], timeStamp, event }) => {
      if (!active || isResizing) {
        return
      }
      const po = Helper.getPositionNearbyInBoundary(boundaryWallCollection,[x, y])
      if(!po?.boundary) return
      setBoundary(po.boundary)
      setPosition(po.position)
      setRotation(po.rotation)
    },
    onDragEnd: () => {
      setIsDraging(false)
      if (props.onDragEnd) {
        props.onDragEnd({
          ...info,
          position: position,
          rotation: rotation,
        });
      }
    }
  },{
    enabled: active && !lock,
    drag: {
      from: () => [position[0], position[1]]
    },
    transform: ([x, y]) => [Math.round(x * 100 / factor) / 100, - Math.round(y * 100 / factor) / 100 ],
  })
  const rotationZ = Array.isArray(rotation) && rotation.length == 3 ? rotation[2] : 0
  const positionVector = new THREE.Vector3(position[0],position[1],0)
  // const dot1 = new THREE.Vector3(position[0]-length/2,position[1],0)
  // const dot2 = new THREE.Vector3(position[0]+length/2,position[1],0)
  const dot11 = new THREE.Vector3(-length/2,0,0).applyAxisAngle(new THREE.Vector3(0,0,1),rotationZ).add(positionVector)
  const dot22 = new THREE.Vector3(length/2,0,0).applyAxisAngle(new THREE.Vector3(0,0,1),rotationZ).add(positionVector)
  const dotPoints = [
    [dot11.x,dot11.y,0],
    [dot22.x,dot22.y,0],
  ]
  // console.log(new THREE.Vector3(-length/2,0,0).applyAxisAngle(new THREE.Vector3(0,0,1),rotationZ))
  const vertices = [
    // Tren
    [new THREE.Vector3(-length/2,-width/2,0.01 * priority),new THREE.Vector3(length/2,-width/2,0.01 * priority)],
    // Phai
    [new THREE.Vector3(length/2,-width/2,0.01 * priority),new THREE.Vector3(length/2,width/2,0.01 * priority)],
    // Duoi
    [new THREE.Vector3(length/2,width/2,0.01 * priority),new THREE.Vector3(-length/2,width/2,0.01 * priority)],
    // Trai
    [new THREE.Vector3(-length/2,width/2,0.01 * priority),new THREE.Vector3(-length/2,-width/2,0.01 * priority)]
  ]
  
  return(
    <>
      <group 
        position={[position[0],position[1],0.01 * priority]}
        rotation={rotation || [0,0,0]}
      >
        <group 
          onClick={() => {
            props.onFocus()
          }}
          {...bind()}
        >
          {Objects.renderDoor({
            ...info,
            position: position,
            rotation: rotation,
            length: length,
            width: width,
            height: height,
          })}
          {/* Green light when active */}
          {
            active == true &&
            <>
              {vertices.map((vertice, i) => {
                // const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertice);
                return (
                  <mesh>
                    <meshLineGeometry points={vertice} />
                    <meshLineMaterial 
                      transparent 
                      lineWidth={0.15 * 50 / factor} 
                      color={'#59b259'} 
                      opacity={0.7}
                      depthWrite={true}
                      toneMapped={true} 
                    />
                  </mesh>
                );
              })}
            </>
          }
        </group>
        {
           active &&
           <Rulers
            boundary={boundary}
            position={position}
            rotation={rotation}
            info={info}
            length={length}
            width={width}
            height={height}
          />
        }
        
      </group>
      {active == true && !enable3D && !lock && (
        <>
          {dotPoints.map((point, i) => {

            return (
              <Dot
                key={i}
                visible={!isResizing && !isDraging}
                imageURL={'/images/2-arrow.png'}
                position={point}
                rotation={rotation || [0,0,0]}
                onDragStart={() => {
                  setIsResizing(true)
                  if (props.onDragStart) props.onDragStart()
                }}
                onDrag={({ delta: [x, y],offset,movement: [x1,y1] }) => {
                  const vtcp = new THREE.Vector3(point[0] - position[0],point[1] - position[1],0)
                  const movementVt = new THREE.Vector3(x1,y1,0)
                  const movementVtProject = movementVt.clone().projectOnVector(vtcp)
                  const angle = new THREE.Vector3(x1,y1,0).angleTo(vtcp)
                  // console.log(angle)
                  let ifa = {...info,length: length,width: width}
                  // const aa = new THREE.Vector3(x,y,0)
                  const changeDistance = (angle - Math.PI/2 <= 0  ? 1 : -1) * movementVtProject.length().toFixed(2);
                  // if(i == 1){
                  //   // Phai
                  //   const changeDistance = (x >= 0 ? 1 : -1) * aa.length().toFixed(2);
                  //   ifa.length += changeDistance;
                  // } else if (i == 0) {
                  //   // Trai
                  //   const changeDistance = (x <= 0 ? 1 : -1) * aa.length().toFixed(2);
                  //   ifa.length += changeDistance;
                  // }
                  ifa.length = Math.abs(info.length + changeDistance);
                  setLength(Math.round(ifa.length * 100)/100)
                  // setWidth(Math.round(ifa.width * 100)/100)
                  if (props.onDrag) {
                    props.onDrag(ifa);
                  }
                }}
                onDragEnd={() => {
                  setIsResizing(false)
                  if (props.onDragEnd) {
                    props.onDragEnd({
                      ...info,
                      position: position,
                      rotation: rotation,
                      length: length,
                      width: width,
                      height: height,
                    });
                  }
                }}
              />
            );
          })}
        </>
      )}
    </>
  )
})

function Rulers(props){
  const priority = 11
  const info = props.info || {}
  const position = props.position || []
  const rotation = props.rotation || []
  // const position = [0,0,0]
  const {length,width,height} = props
  const boundary = props.boundary || []
  const vertices = [
    // Thang
    [new THREE.Vector3(0 - length/2, 0 - width/2 - RulerDistance,0),new THREE.Vector3(0 + length/2, 0 - width/2 - RulerDistance,0)],
    [new THREE.Vector3(0 - length/2,0 - width/2 - RulerDistance - 0.2,0),new THREE.Vector3(0 - length/2,0 - width/2 - RulerDistance + 0.2,0)],
    [new THREE.Vector3(0 + length/2,0 - width/2 - RulerDistance - 0.2,0),new THREE.Vector3(0 + length/2,0 - width/2 - RulerDistance + 0.2,0)]
  ];
  
  const font = new FontLoader().parse(Roboto);
  const textPosition = new THREE.Vector3(0,0 - width/2 - RulerDistance - 0.05,0)
  // const textAngle = vtpt.angleTo(new THREE.Vector3(0,1,0))
  let verticeThang2 = []
  let vertice2DauBoundary = []
  const rotationZ = Array.isArray(rotation) && rotation.length == 3 ? rotation[2] : 0
  if (Array.isArray(boundary) && boundary.length == 2) {
    const boundaryPoint = new THREE.Vector3(boundary[0][0] - position[0],boundary[0][1] - position[1],0).applyAxisAngle(new THREE.Vector3(0,0,1),rotationZ)
    const startPoint = new THREE.Vector3(0 - length/2, 0,0)
    const vtpt = boundaryPoint.clone().sub(startPoint).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).setLength(RulerDistance + width/2)
    // console.log(vtpt)
    verticeThang2 = [  
      // [
      //   boundaryPoint.clone().sub(vtpt),
      //   startPoint.clone().sub(vtpt),
      // ],
      // [
      //   new THREE.Vector3(boundary[1][0] - position[0],boundary[1][1] - position[1],0),
      //   new THREE.Vector3(0 + length/2, 0 + width/2 + RulerDistance,0)
      // ],
    ];
    vertice2DauBoundary = [  
      // [
      //   new THREE.Vector3( - length/2 - boundary[0][0] + position[0] - 0.2, - boundary[0][1] + position[1] + width/2 + RulerDistance,0),
      //   new THREE.Vector3( - length/2 - boundary[0][0] + position[0] + 0.2, - boundary[0][1] + position[1] + width/2 + RulerDistance,0),
      // ],
      // [
        
      // ],
    ];
  }
  return(
    <>
      {/* Duong kinh chinh */}
      {vertices.map((vertice, i) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertice)
        return(
          <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#000" />
          </line>
        )
      })}
      
      <mesh 
        position={[textPosition.x,textPosition.y,0]} 
      >
        <textGeometry
          args={[length + "", { font, size: 0.3, height: 0.05 }]}
        />
        <meshPhongMaterial attach="material" color={"#000"} />
      </mesh>
      {/* Duong kinh so voi tuong trai */}
      {verticeThang2.map((vertice, i) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertice)
        return(
          <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#000" />
          </line>
        )
      })}
      {/* Duong kinh so voi tuong phai */}
      {vertice2DauBoundary.map((vertice, i) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertice)
        return(
          <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#000" />
          </line>
        )
      })}
    </>
  );
}

export default Door;
