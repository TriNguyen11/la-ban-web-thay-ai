import React,{useRef,useState,useEffect} from 'react'
import {
  Row,Col
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';

import {Components, APIs,Helper} from '@floorplan/App'

import * as THREE from 'three'
import { Canvas, useFrame,useThree } from '@react-three/fiber'
const { useGLTF, OrbitControls,useTexture,PivotControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"

const minSize = 0.2
function Dot(props){
  const priority = 10
  const visible = props.visible == false ? false : true
  // console.log(props.visible,visible)
  const imageURL = props.imageURL || '/images/4-arrow.png'
  const { viewport } = useThree()
  const { factor } = viewport
  const position = props.position
  const rotation = props.rotation || [0,0,0]
  const image = React.useMemo(() => new THREE.TextureLoader().load(imageURL), [imageURL]);
  const bind = useGesture({
    onDragStart: (data) => {
      // data.preventDefault()
      // console.log(data.preventDefault())
      if (props.onDragStart) {
        props.onDragStart({...data})
      }
      
    },
    onDrag: (data) => {
      if(!data.active)return
      // console.log(data)
      // data.event.preventDefault()
      if (props.onDrag) {
        props.onDrag({...data})
      }
    },
    onDragEnd: (data) => {
      // console.log(data)
      if (props.onDragEnd) {
        props.onDragEnd({...data})
      }
    },
  },{
    // preventDefault: 'all',
    eventOptions: { passive: true },
    drag: {
      from: () => [position[0], position[1]]
    },
    transform: ([x, y]) => [x / factor, -y / factor]
  })
  if(!position){return(<></>)}
  return(
    <group 
      visible={visible}
      position={[position[0], position[1], 0.01 * priority]}
      rotation={rotation}
      {...bind()}
    >
      <mesh>
        <circleGeometry 
          attach="geometry" 
          args={[minSize * 50 / factor > minSize ? minSize * 50 / factor : minSize,100]} 
        />
        <meshBasicMaterial
          attach="material"
          transparent
          map={image}
        />
      </mesh>
    </group>
  )
}

export default Dot
