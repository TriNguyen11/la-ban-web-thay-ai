import React,{useRef,useState,useEffect} from 'react'
import {
  Row,Col
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';

import {Components, APIs,Helper} from '@floorplan/App'

import * as THREE from 'three'
import { Canvas, useFrame,useThree,extend } from '@react-three/fiber'
const { useGLTF, OrbitControls,useTexture } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })


const Draging = React.forwardRef((props, ref) => {
  const info = props.info || {}
  const [boundaries, setBoundaries] = React.useState([])
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  
  React.useImperativeHandle(ref, () => ({
    setBoundaries: setBoundaries
  }))
  
  return(
    <>
      {(Array.isArray(boundaries) && boundaries.length >= 3 ? boundaries : []).map((boundary, i) => {
        const nextPoint = boundaries[(i + 1) % boundaries.length];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(boundary[0],boundary[1],0),
          new THREE.Vector3(nextPoint[0],nextPoint[1],0)
        ]);
        return(
          <line
            geometry={lineGeometry}
            onUpdate={(line) => line.computeLineDistances()}>
            <lineDashedMaterial
              attach="material"
              color="#000"
              dashSize={0.2}
              gapSize={0.2}
            />
          </line>
        )
      })}
    </>
  )
})
export default Draging
