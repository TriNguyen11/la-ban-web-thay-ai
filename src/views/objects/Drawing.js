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


const Drawing = React.forwardRef((props, ref) => {
  const info = props.info || {}
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  const [data,setData] = React.useState([])

  const findNextPoint = (startIndex = 0,points = []) => {
    let prevPoint = null
    let prevIndex = (i - 1 + points.length) % points.length
    if(prevIndex>0){
      prevPoint = new THREE.Vector2(points[prevIndex][0],points[prevIndex][1])
    }
    const currentPoint = new THREE.Vector2(data[startIndex][0],data[startIndex][1])
    data.map((item,key) => {
      if (key > startIndex) {
        const point = new THREE.Vector2(item[0],item[1])
        if (currentPoint.clone().sub(point).length() >= 0.3
          ) {
          if(prevPoint){
            
          }
          return {
            point: item,
            index: key
          }
        }
        
      }
    })
    
  }

  const getBoundaries = () => {
    let points = []
    if (data.length <= 4) return points
    // points.push(data[0])
    // const startPoint = new THREE.Vector2(data[0][0],data[0][1])
    // data.map((item,i) => {
    //   const currentPointArr = points[points.length - 1]
    //   const prevPointArr = points[(i - 1 + points.length) % points.length]
    //   const currentPoint = new THREE.Vector2(currentPointArr[0],currentPointArr[1])
    //   const prevPoint = new THREE.Vector2(prevPointArr[0],prevPointArr[1])
    //   if (points.length == 1) {
    //     // console.log('aaa')
    //     points.push(item)
    //     return false
    //   }
    //   const point = new THREE.Vector2(item[0],item[1])
      
    //   if(point.clone().sub(currentPoint).angleTo(prevPoint.clone().sub(currentPoint)) >= Math.PI*150/180 
    //     || point.clone().sub(currentPoint).length() < 1
    //   ){
    //     points[points.length - 1] = item
    //   }else if(point.clone().sub(startPoint).length() >= 1){
    //     // console.log(point.clone().sub(prevPoint).angleTo(currentPoint.clone().sub(prevPoint)) * 180/Math.PI)
    //     points.push(item)
    //   }
    // })
    // return points
    let minXMaxYIndex = 0
    const minXMaxYPoint = new THREE.Vector2(data[0][0],data[0][1])
    let maxXMaxYIndex = 0
    const maxXMaxYPoint = new THREE.Vector2(data[1][0],data[1][1])
    let minXminYIndex = 0
    const minXminYPoint = new THREE.Vector2(data[2][0],data[2][1])
    let maxXminYIndex = 0
    const maxXminYPoint = new THREE.Vector2(data[3][0],data[3][1])
    // // console.log(data)
    data.map((item,key) => {
      const point = new THREE.Vector2(item[0],item[1])
      // console.log(key,':',item)
      if (minXMaxYPoint.x >= point.x && minXMaxYPoint.y <= point.y) {
        minXMaxYIndex = key
        minXMaxYPoint.set(point.x,point.y)
      }else if (maxXMaxYPoint.x <= point.x && maxXMaxYPoint.y <= point.y) {
        maxXMaxYIndex = key
        maxXMaxYPoint.set(point.x,point.y)
      }else if (minXminYPoint.x >= point.x && minXminYPoint.y >= point.y) {
        minXminYIndex = key
        minXminYPoint.set(point.x,point.y)
      }else if (maxXminYPoint.x <= point.x && maxXminYPoint.y >= point.y) {
        maxXminYIndex = key
        maxXminYPoint.set(point.x,point.y)
      }
    })
    
    const indexs = [minXMaxYIndex,maxXMaxYIndex,minXminYIndex,maxXminYIndex].sort(function(a, b){return a - b})
    
    let remakeIndexs = [indexs[0]]
    indexs.slice(1).map((index,i) => {
      const prevIndex = (i - 1 + remakeIndexs.length) % remakeIndexs.length
      const point = new THREE.Vector2(data[index][0],data[index][1])
      const prevPoint = new THREE.Vector2(remakeIndexs[prevIndex][0],remakeIndexs[prevIndex][1])
      if(point.clone().sub(prevPoint).length() >= 0.5 && !remakeIndexs.includes(index)){
        remakeIndexs.push(index)
      }
    })

    // console.log(remakeIndexs)
    remakeIndexs.map((index,i) => {
      points.push(data[index]) 
      const startPoint = new THREE.Vector2(points[0][0],points[0][1])
      const nextIndex = (i - 1 + indexs.length) % indexs.length
      let minAngle = 180
      let pointToAdd = null 
      for (let j = index; j < (i >= indexs.length - 1 ? data.length : nextIndex); j++) {
        const point = new THREE.Vector2(data[j][0],data[j][1])
        const prevPoint = new THREE.Vector2(data[index][0],data[index][1])
        const nextPoint = new THREE.Vector2(data[nextIndex][0],data[nextIndex][1])
        const angle = prevPoint.clone().sub(point).angleTo(nextPoint.clone().sub(point))
        if(angle <= Math.PI*150/180 
            && point.clone().sub(prevPoint).length() > 0.5 
            && point.clone().sub(nextPoint).length() > 0.5
            && point.clone().sub(startPoint).length() > 0.5){
            minAngle = angle
            pointToAdd = data[j]
        }
      }
      if(pointToAdd){
        points.push(pointToAdd)
      }
    })
    // console.log(points)
    return points
  }
  
  React.useImperativeHandle(ref, () => ({
    isDrawing: ({ active, offset: [x, y], timeStamp, event }) => {
      let dt = [...data]
      dt.push([x,y])
      setData(dt)
    },
    getBoundaries: getBoundaries,
    reset: () => {
      setData([])
    }
  }))

  let points = []
  data.map(item => {
    points.push(item[0],item[1],0)
  })
  return(
    <>
      <mesh>
        <meshLineGeometry points={points} />
        <meshLineMaterial lineWidth={0.42} color="#000" />
      </mesh>
    </>
  )
})
export default Drawing
