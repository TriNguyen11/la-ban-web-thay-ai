import React,{useRef,useState,useEffect} from 'react'
import {
  Row,Col
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';

import {Components, APIs,Helper} from '@floorplan/App'

import * as THREE from 'three'
import { Canvas, useFrame,useThree,extend } from '@react-three/fiber'
const { useGLTF, OrbitControls,PivotControls } = require("@react-three/drei");
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useGesture } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import Roboto from "@floorplan/fonts/Roboto_Regular.json"
extend({TextGeometry,MeshLineGeometry, MeshLineMaterial});

import Dot from "./Dot";

const caculateDegree = (x,y,a,b) => {
  // console.log(x,y,a,b)
  const R = Math.sqrt( Math.pow(a - x, 2) + Math.pow(b - y, 2) )
  if (a - x <= 0 && b - y  >= 0) {
    const sina = (x - a) / R
    return Math.asin(sina) * 180 / Math.PI
  }else if(a - x <= 0 && b - y  <= 0){
    const sina = (x - a) / R
    // console.log(180 - Math.asin(sina) * 180 / Math.PI)
    return 180 - Math.asin(sina) * 180 / Math.PI
  }else if(a - x >= 0 && b - y  <= 0){
    const sina = (a - x) / R
    return 180 + Math.asin(sina) * 180 / Math.PI
  }else if(a - x >= 0 && b - y  >= 0){
    const sina = (b - y) / R
    return 270 + Math.asin(sina) * 180 / Math.PI
  }else{
    // console.log(x,y,a,b,'test')
    return 0;
  }
}

function Wall(props) {
  const priority = 2
  const { viewport } = useThree()
  const { factor } = viewport;

  const info = props.info || {}
  const enable3D = props.enable3D || false
  const bridgeRef = React.useRef()
  const [boundary, setBoundary] = React.useState(info.boundary || []);
  const [length, setLength] = React.useState(info.length || 0)
  const width = info.width || 0.38
  const height = info.height || 3
  
  const active = props.active || false
  const lock = info.lock || false;
  const hideResizeButton = props.hideResizeButton == true ? true: false
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDraging, setIsDraging] = React.useState(false);

  const getBoundaries = () => {
    let bdr = []
    const trentrai = vtcp.clone().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2).add(startPoint).setZ(0)
    const trenphai = vtcp.clone().negate().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(endPoint).setZ(0)
    const duoitrai = vtcp.clone().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(startPoint).setZ(0)
    const duoiphai = vtcp.clone().negate().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2).add(endPoint).setZ(0)
    bdr.push([trentrai.x,trentrai.y])
    bdr.push([trenphai.x,trenphai.y])
    bdr.push([duoitrai.x,duoitrai.y])
    bdr.push([duoiphai.x,duoiphai.y])
    return bdr
  }
  
  const bind = useGesture({
    onDragStart: (event) => {
      setIsDraging(true)
      if(props.onDragStart){
        props.onDragStart(event)
      }
    },
    onDrag: (event) => {
      if (!event.active || isResizing || lock) {
        return;
      }
      const [x,y] = event.movement
      const oldBoundary = info.boundary || [];

      // const movementVector = new THREE.Vector3(x, y, 0);

      let bdr = [...boundary];
      bdr[0] = [oldBoundary[0][0] + x, oldBoundary[0][1] + y]
      bdr[1] = [oldBoundary[1][0] + x, oldBoundary[1][1] + y]
      const newLength = new THREE.Vector2(bdr[0][0],bdr[0][1]).sub(new THREE.Vector2(bdr[1][0],bdr[1][1])).length().toFixed(2)
      setLength(newLength)
      setBoundary(bdr);
      if(props.onDrag){
        props.onDrag({
          ...info,
          length: newLength,
          boundary: boundary,
          boundaries: getBoundaries()
        })
      }
    },
    onDragEnd:(event) => {
      setIsDraging(false)
      if(props.onDragEnd){
        props.onDragEnd({
          ...info,
          length: length,
          boundary: boundary,
          boundaries: getBoundaries()
        })
      }
    },
    onHover: ({ hovering }) => {
      
    }
  },{
    enabled: active && !enable3D,
    transform: ([x, y]) => [x / factor, -y / factor]
  })

  if (boundary?.length != 2) {
    return
  }

  React.useEffect(() => {
    const ifo = props.info || {};
    if (Array.isArray(ifo.boundary) && ifo.boundary.length == 2) {
      const newLength = new THREE.Vector2(ifo.boundary[0][0],ifo.boundary[0][1])
                      .sub(new THREE.Vector2(ifo.boundary[1][0],ifo.boundary[1][1])).length().toFixed(2)
      setLength(newLength)
      setBoundary(ifo.boundary);
    }
  }, [props.info]);
  
  const startPoint = new THREE.Vector3(boundary[0][0],boundary[0][1],0)
  const endPoint = new THREE.Vector3(boundary[1][0],boundary[1][1],0)
  const vtcp = endPoint.clone().sub(startPoint)
  const distance = new THREE.Vector2(startPoint.x,startPoint.y).distanceTo(new THREE.Vector2(endPoint.x,endPoint.y))
  // const deltaAngle = new THREE.Vector2(0,1)
  //                 .angleTo(new THREE.Vector2(endPoint.x - startPoint.x,endPoint.y - startPoint.y))
  
  
  const addVector = startPoint.clone().add(endPoint)
  const deltaAngle = caculateDegree(endPoint.x,endPoint.y,addVector.x/2,addVector.y/2) * Math.PI / 180
  // console.log(endPoint.x,endPoint.y,addVector.x/2,addVector.y/2,deltaAngle * 180/Math.PI)
  // const vertice = [new THREE.Vector3(startPoint.x,startPoint.y,0.01 * priority),new THREE.Vector3(endPoint.x,endPoint.y,0.01 * priority)]
  const greenLightDistance = width/2
  const trentrai = vtcp.clone().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2).add(startPoint).setZ(0.01 * priority + 0.001)
  const trenphai = vtcp.clone().negate().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(endPoint).setZ(0.01 * priority + 0.001)
  const duoitrai = vtcp.clone().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(startPoint).setZ(0.01 * priority + 0.001)
  const duoiphai = vtcp.clone().negate().setLength(width/2).applyAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2).add(endPoint).setZ(0.01 * priority + 0.001)
  const greenLightVertices = [
    // Tren
    [trentrai,trenphai],
    // Phai
    [trenphai,duoiphai],
    // Duoi
    [duoitrai,duoiphai],
    // Trai
    [trentrai,duoitrai],
  ]
  return(
    <>
      <mesh
        ref={bridgeRef}
        position={[addVector.x/2,addVector.y/2, enable3D ? height/2 : 0.01 * priority]}
        rotation={[0,0,deltaAngle]}
        {...bind()}
        onClick={() => {
          if(props.onFocus) props.onFocus()
        }}
      >
        {
          enable3D
          ?<boxGeometry 
            attach="geometry" 
            args={[width, distance,height]} 
            receiveShadow={true}
            castShadow={true}
          />
          :<planeGeometry
          attach="geometry" 
          args={[width, distance]} />
        }
        
        <meshBasicMaterial
          attach="material"
          color={"#404142"}
          // transparent
        />
        
      </mesh>
      {/* Green light when active */}
      {
        active == true &&
        <>
          {greenLightVertices.map((vertice, i) => {
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
      {!hideResizeButton && active == true && !lock && !enable3D && (
        <>
          {boundary.map((item, i) => {
            return (
              <Dot
                key={i}
                visible={!isResizing && !isDraging}
                position={item}
                onDragStart={() => {
                  // console.log('aads')
                  setIsResizing(true);
                  if (props.onDragStart) props.onDragStart();
                }}
                onDrag={({ offset: [x, y], initial }) => {
                  const oldBoundary = info.boundary || [];
                  let bdr = [...boundary];
                  bdr[i] = [x, y]
                  const newLength = new THREE.Vector2(bdr[0][0],bdr[0][1]).sub(new THREE.Vector2(bdr[1][0],bdr[1][1])).length().toFixed(2)

                  if (newLength<1) {
                    return
                  }

                  setLength(newLength)
                  setBoundary(bdr);

                  if (props.onDrag) {
                    props.onDrag({
                      ...info,
                      boundary: boundary,
                      boundaries: getBoundaries(),
                      length: newLength,
                    });
                  }
                }}
                onDragEnd={() => {
                  setIsResizing(false);
                  if (props.onDragEnd) {
                    props.onDragEnd({ ...info, boundary: boundary,boundaries: getBoundaries() });
                  }
                }}
              />
            );
          })}
        </>
      )}
      {!hideResizeButton && active && (
        <Rulers
          info={info}
          boundary={boundary}
          length={length}
          width={width}
          height={height}
        />
      )}
    </>
  )
}
const RulerDistance = 0.4
function Rulers(props) {
  const {length,width,height} = props
  const boundary = props.boundary || []
  const startPoint = new THREE.Vector3(boundary[0][0],boundary[0][1],0)
  const endPoint = new THREE.Vector3(boundary[1][0],boundary[1][1],0)
  const vtcp = endPoint.clone().sub(startPoint)
  const trentrai = vtcp.clone().setLength(width/2 + RulerDistance).applyAxisAngle(new THREE.Vector3(0,0,1),-Math.PI/2).add(startPoint)
  const trenphai = vtcp.clone().negate().setLength(width/2 + RulerDistance).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).add(endPoint)
  const vertices = [
    // Thang
    // [new THREE.Vector3(0 - length/2, 0 - width/2 - RulerDistance,0),new THREE.Vector3(0 + length/2, 0 - width/2 - RulerDistance,0)],
    // [new THREE.Vector3(0 - length/2,0 - width/2 - RulerDistance - 0.2,0),new THREE.Vector3(0 - length/2,0 - width/2 - RulerDistance + 0.2,0)],
    // [new THREE.Vector3(0 + length/2,0 - width/2 - RulerDistance - 0.2,0),new THREE.Vector3(0 + length/2,0 - width/2 - RulerDistance + 0.2,0)]
    [trentrai,trenphai],
    [
      startPoint.clone().sub(trentrai).setLength(0.1).add(trentrai),
      startPoint.clone().sub(trentrai).setLength(0.1).negate().add(trentrai),
    ],
    [
      endPoint.clone().sub(trenphai).setLength(0.1).add(trenphai),
      endPoint.clone().sub(trenphai).setLength(0.1).negate().add(trenphai),
    ]
  ];
  
  const font = new FontLoader().parse(Roboto);
  const center = vtcp.clone().divideScalar(2).add(startPoint)
  const textPosition = startPoint.clone().sub(center).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2).setLength(RulerDistance + width/2).add(center)
  const textAngle = vtcp.clone().angleTo(new THREE.Vector3(-1,0,0))
  // console.log(textAngle)
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
        rotation={[0,0,textAngle]}
      >
        <textGeometry
          args={[length + "", { font, size: 0.3, height: 0.02 }]}
        />
        <meshPhongMaterial attach="material" color={"#000"} />
      </mesh>
    </>
  )
}

export default Wall
