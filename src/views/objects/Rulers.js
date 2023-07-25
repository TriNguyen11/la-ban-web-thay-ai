import React,{useRef,useState,useEffect} from 'react'
import {
  Row,Col
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';

import {Components, APIs,Helper} from '@floorplan/App'

import * as THREE from 'three'
import { Canvas, useFrame,useThree, extend } from '@react-three/fiber'
const { useGLTF, OrbitControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

const Rulers = React.forwardRef((props, ref) => {
  const { size,viewport,camera } = useThree();
  const { factor,aspect } = viewport;
  const boundaryCollection = props.boundaryCollection || []
  const [dragingBoundaries, setDragingBoundaries] = React.useState([]);
  // Use this from another hook.
  React.useImperativeHandle(ref, () => ({
    setDragingBoundaries: setDragingBoundaries,
  }))

  let vertices = []
  // console.log('aaaa')
  boundaryCollection.map((boundaries,key) => {
    boundaries.map((point,key2) => {
      if(point == dragingBoundaries) return
      const j = (key2 + 1) % boundaries.length;
      const point1 = new THREE.Vector3(point[0],point[1],0.05); 
      const point2 = new THREE.Vector3(boundaries[j][0],boundaries[j][1],0.05);
      dragingBoundaries.map((dr,key3) => {
        const pointToCheck = new THREE.Vector3(dr[0],dr[1],0.05);  
        var c = new THREE.Vector3();   
        c.crossVectors(point1.clone().sub(pointToCheck), point2.clone().sub(pointToCheck));
        // console.log(c.length())
        if (c.length() < 0.1) {
          // console.log(c.length())
          // Lọc những đường gần trùng với đường đã add. (Góc nhỏ hơn hơn 5°)
          let checked = true
          vertices.map((vetice) => {
            const angle = vetice[0].clone().sub(vetice[1]).angleTo(point1.clone().sub(point2))
            const distance = point1.distanceTo(vetice[0].clone().sub(vetice[1]))
            
            // console.log(angle)
            if ((angle < Math.PI/36 || angle > Math.PI * 35/36) && distance < 0.1) {
              checked = false
              return;
            }
          })
          if(checked) vertices.push([point1,point2])
        }
        
      })
    })
  })


  return(
    <>
      {vertices.map((point2, i) => {
        const vtcp = point2[0].clone().sub(point2[1].clone()).setLength(viewport.width)
        const lineGeometry = [
          point2[0].clone().add(vtcp),point2[1].clone().add(vtcp.negate())
        ]
        return(
          <mesh>
            <meshLineGeometry points={lineGeometry} />
            <meshLineMaterial
              transparent
              lineWidth={(0.075 * 50) / factor}
              color={"#59b259"}
              opacity={1}
              dashArray={0.01}
              dashRatio={0.5}
            />
          </mesh>
        )
      })}
    </>
  )
})

export default Rulers
