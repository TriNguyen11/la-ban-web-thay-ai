import React, { useRef, useState, useEffect,Suspense } from "react";
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

import { Components, APIs, Helper } from "@floorplan/App";

const ThuocDoPhanCung = React.forwardRef((props, ref) => {
  const visible = props.visible || false
  const [direction,setDirection] = React.useState(props.direction || 0)
  React.useEffect(() => {
    
  },[])
  
  React.useImperativeHandle(ref, () => ({
    setDirection: setDirection
  }))
  
  if(!visible) return <></>
  
  return(
    <div className="position-absolute top-0 left-0 bottom-0 right-0" style={{zIndex: 100}}>
      <Canvas className="w-100 h-100">
        <Suspense>
          <ThuocDo direction={direction} onClickChangePhanCungDirection={props.onClickChangePhanCungDirection}/>
          <LabanChia direction={direction}/>
          
        </Suspense>
      </Canvas>
    </div>
  )
})

function ThuocDo(props){
  const { viewport } = useThree()
  const { aspect,factor } = viewport;
  // console.log(viewport)
  const direction = props.direction || 0
  const imageURL = '/la-ban/phan-cung.png'
  const image = React.useMemo(() => new THREE.TextureLoader().load(imageURL), [imageURL]);
  const width = viewport.width/(aspect * 3)
  const lineRedGeometry = [new THREE.Vector3(0,0,0),new THREE.Vector3(0,width,0.01)]
  const font = new FontLoader().parse(Roboto);
  return(
    <>
      <mesh 
        position={[0,0,0.01]} 
        rotation={[0,0,Math.PI * direction / 180]}
        onClick={() => {
          props.onClickChangePhanCungDirection()
        }}
      >
        <circleGeometry 
          attach="geometry" 
          args={[viewport.width/(aspect * 3.2),100]} 
        />
        <meshBasicMaterial
          attach="material"
          transparent
          map={image}
        />
      </mesh>
      <mesh>
        <meshLineGeometry points={lineRedGeometry} />
        <meshLineMaterial
          lineWidth={0.015}
          color={"red"}
          opacity={1}
        />
      </mesh>
      <mesh>
        <meshLineGeometry points={[new THREE.Vector3(-0.3,width,0.01), new THREE.Vector3(0.3,width,0.01)]} />
        <meshLineMaterial
          lineWidth={0.4}
          color={"red"}
          opacity={1}
        />
      </mesh>
      <mesh
        position={[0, width, 0.015]}
        onUpdate={(textGeo) => {
          textGeo.geometry.center()
        }}
      >
        <textGeometry
          args={[direction + '°', { font, size: 0.15, height: 0.02 }]}
        />
        <meshPhongMaterial attach="material" color={"#000"} />
      </mesh>
    </>
  )
}

function Tinhdiem(width,degree){
  if(degree <= 45){
    return [ width * Math.tan(degree * Math.PI / 180), width]
  }else if(degree > 45 && degree <= 90){
    return [width, width * Math.tan((90 - degree) * Math.PI / 180)]
  }else if(degree > 90 && degree <= 135){
    return [width, - width * Math.tan((135 - degree) * Math.PI / 180)]
  }else if(degree > 135 && degree <= 180){
    return [ width * Math.tan((180 - degree) * Math.PI / 180), -width]
  }else if(degree > 180 && degree <= 225){
    return [ -width * Math.tan((degree - 180) * Math.PI / 180), -width]
  }else if(degree > 225 && degree <= 270){
    return [ -width, - width * Math.tan((270 - degree) * Math.PI / 180)]
  }else if(degree > 270 && degree <= 315){
    return [ -width, width * Math.tan((degree - 270) * Math.PI / 180)]
  }else if(degree > 315 && degree <= 360){
    return [ -width * Math.tan((360 - degree) * Math.PI / 180), width]
  }
  return [0,0]
}

function LabanChia(props){
  const { viewport } = useThree()
  const { aspect,factor } = viewport;
  const width = viewport.width/(aspect * 3)
  const points = [
    Tinhdiem(width, 337.5),Tinhdiem(width, 22.5),
    Tinhdiem(width, 67.5), Tinhdiem(width, 112.5),
    Tinhdiem(width, 157.5),Tinhdiem(width, 202.5),
    Tinhdiem(width, 247.5),Tinhdiem(width, 292.5)
  ]
  const colors = [
    "rgba(116, 164, 228, 0.3)", "rgba(222, 205, 136, 0.4)",
    "rgba(179, 220, 142, 0.4)", "rgba(179, 220, 142, 0.4)",
    "rgba(255, 84, 84, 0.4)", "rgba(230, 194, 80, 0.4)",
    "rgba(188, 188, 188, 0.3)", "rgba(188, 188, 188, 0.3)"
  ]
  const lineLength = viewport.width;
  const point2s = [
    Tinhdiem(lineLength, 7.5),Tinhdiem(lineLength, 22.5), Tinhdiem(lineLength, 37.5), Tinhdiem(lineLength, 52.5),
    Tinhdiem(lineLength, 67.5), Tinhdiem(lineLength, 82.5), Tinhdiem(lineLength, 97.5), Tinhdiem(lineLength, 112.5), Tinhdiem(lineLength, 127.5),
    Tinhdiem(lineLength, 142.5), Tinhdiem(lineLength, 157.5), Tinhdiem(lineLength, 172.5), Tinhdiem(lineLength, 187.5), Tinhdiem(lineLength, 202.5),
    Tinhdiem(lineLength, 217.5), Tinhdiem(lineLength, 232.5), Tinhdiem(lineLength, 262.5),
    Tinhdiem(lineLength, 247.5), Tinhdiem(lineLength, 277.5), Tinhdiem(lineLength, 292.5), Tinhdiem(lineLength, 307.5), Tinhdiem(lineLength, 322.5),
    Tinhdiem(lineLength, 352.5),Tinhdiem(lineLength, 337.5)
  ]
  
  return(
    <>
      {points.map((point, key) => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(point[0], point[1]);
        const nextPoint = points[key + 1] != null && Array.isArray(points[key + 1]) ? points[key + 1] : points[0];
        shape.lineTo(nextPoint[0], nextPoint[1]);
        return(
          <mesh>
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial
              attach="material"
              color={colors[key]}
              transparent
              sizes={0.3}
              opacity={0.7}
            />
          </mesh>
        )
      })}
      {point2s.map((point, key) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0,0,0),new THREE.Vector3(point[0],point[1],0)
        ]);
        return (
          <line geometry={lineGeometry} onUpdate={(line) => line.computeLineDistances()}>
            <lineDashedMaterial 
              attach="material" 
              color="#000" 
              lineWidth={1}
              dashSize={0.1}
              gapSize={0.1}
            />
          </line>
        )
      })}
      
    </>
  )
}

export default ThuocDoPhanCung;
