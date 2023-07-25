import React, { useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { Components, APIs, Helper } from "@floorplan/App";

import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
const { useGLTF, OrbitControls } = require("@react-three/drei");
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import Helpers from "@floorplan/helper";
import Wall from "./Wall";
import Dot from "./Dot";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import Roboto from "@floorplan/fonts/Roboto_Regular.json";
extend({TextGeometry,MeshLineGeometry, MeshLineMaterial});

const RulerDistance = 1.5;

const Room = React.forwardRef((props, ref) => {
  const priority = 0;
  const info = props.info || {};
  const containerRef = React.useRef();
  const [position, setPosition] = React.useState(info.position || [0,0,0]);
  const enable3D = props.enable3D || false;
  const { length, width, height } = info;
  const { viewport } = useThree();
  const { factor } = viewport;
  const [boundaries, setBoundaries] = React.useState(info.boundaries || []);
  const [boundariesParent, setBoundariesParent] = React.useState(
    info.boundariesParent || []
  );

  const active = props.active || false
  const lock = info.lock || false;
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDraging, setIsDraging] = React.useState(false);
  const [isDragingDot, setIsDragingDot] = React.useState(false);
  const [rotating, setRotating] = React.useState(false);
  

  React.useEffect(() => {
    const ifo = props.info || {};
    setPosition(ifo.position);
    setBoundaries(ifo.boundaries);
  }, [props.info]);

  
  const getCenter = () => {
    if (
      !containerRef ||
      !containerRef.current ||
      !containerRef.current.geometry
    ) {
      return;
    }
    var geometry = containerRef.current.geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    containerRef.current.localToWorld(center);
    // center.applyMatrix4( containerRef.current.matrixWorld );
    // var center = geometry.boundingSphere.center
    // console.log(geometry)

    return center;
  };
  React.useImperativeHandle(ref, () => ({
    priority,
    getCenter: getCenter,
    setPosition: (po) => {
      setPosition(po);
    },
    setBoundaries: setBoundaries,
    setBoundariesParent: setBoundariesParent,
  }));
  var positions = [];

  for (let i = 0; i < boundaries.length; i++) {
    const nextPoint = boundaries[(i + 1) % boundaries.length];
    const nextPoint2 = boundaries[(boundaries.length - i) % boundaries.length];
    positions.push(boundaries[i][0], boundaries[i][1], 0.1);
    positions.push(nextPoint[0], nextPoint[1], 0.1);
    positions.push(nextPoint2[0], nextPoint2[1], 0.1);
  }
  positions = new Float32Array(positions);

  // const center = getCenter();
  const ct = Helper.getPolygonCentroid(info.boundaries || [])
  const centroid = new THREE.Vector3(ct[0] || 0,ct[1] || 0,0)
  
  const bind = useGesture(
    {
      onDragStart:() => {
        setIsDraging(true)
        if (props.onDragStart) props.onDragStart()
      },
      onDrag: ({ active, movement: [x, y] }) => {
        if (!active || isResizing) {
          return;
        }
        
        const oldBoundaries = info.boundaries || [];
        let bdr = [...boundaries];
        for (let i = 0; i < bdr.length; i++) {
          bdr[i] = [oldBoundaries[i][0] + x, oldBoundaries[i][1] + y];
        }
        const oldPosition = info.position || [0,0,0]
        setPosition([(oldPosition[0] || 0) + x, (oldPosition[1] || 0) + y, 0])
        setBoundaries(bdr);
        if (props.onDrag) {
          props.onDrag({
            ...info,
            boundaries: boundaries,
            wallBoundaries: getWallBoundaries(),
            position: position,
            boundariesBefore: info.boundaries,
          });
        }
      },
      onDragEnd: () => {
        setIsDraging(false)
        setRotating(false)
        if (props.onDragEnd) {
          props.onDragEnd({ 
            ...info,
            position: position, 
            boundaries: boundaries,
            wallBoundaries: getWallBoundaries(),
          });
        }
      },
    },
    {
      enabled: active && !lock && !enable3D,
      drag: {
        from: () => (centroid && centroid.x ? [centroid.x, centroid.y] : [0, 0]),
      },
      transform: ([x, y]) => [Math.round(x * 100 / factor) / 100, - Math.round(y * 100 / factor) / 100 ],
    }
  );
  function roundedRect() {
    const shape = new THREE.Shape();
    shape.moveTo(boundaries[0][0], boundaries[0][1]);
    boundaries.map((item) => {
      shape.lineTo(item[0], item[1]);
    });

    return shape;
  }
  const getWallBoundaries = () => {
    return Helper.getWallBoundaries(boundaries)
  }
  const renderWall = (props) => {
    const walllBdrs = getWallBoundaries()
    return(
      <>
        {walllBdrs.map((boundary, i) => {
          const nextBoundary = walllBdrs[(i + 1) % walllBdrs.length]
          return(
            <Wall
              key={i}
              enable3D={enable3D}
              active={false}
              lock={lock || isDragingDot}
              hideResizeButton={true}
              info={{
                boundary: [boundary,nextBoundary],
                width: 0.38,
                height: 3
              }}
              onClick={() => {
                props.onFocus();
              }}
            />
          )
        })}
      </>
    )
  }
  // if (!Array.isArray(position) || position.length != 3) {
  //   return <></>;
  // }
  // console.log(props.children || '')
  
  
  return (
    <>
      {boundaries.map((boundary, i) => {
        const prevIndex = (i - 1 + boundaries.length) % boundaries.length
        const nextIndex = (i + 1) % boundaries.length
        const next2Index = (i + 2) % boundaries.length
        // console.log(prevIndex)
        const nextBoundary = boundaries[nextIndex];
        const centerPoint = [
          (nextBoundary[0] + boundary[0]) / 2,
          (nextBoundary[1] + boundary[1]) / 2,
          0,
        ];
        const angle = new THREE.Vector2(
          nextBoundary[0] - boundary[0],
          nextBoundary[1] - boundary[1]
        ).angleTo(new THREE.Vector2(0, 1));

        const point = new THREE.Vector3(boundary[0],boundary[1],0)
        const nextPoint = new THREE.Vector3(boundaries[nextIndex][0],boundaries[nextIndex][1],0)
        return (
          <>
            {active == true && !lock && !enable3D && (
              <Dot
                visible={!isResizing && !isDraging && !rotating}
                imageURL={"/images/2-arrow.png"}
                rotation={[0, 0, angle]}
                position={centerPoint}
                onDragStart={() => {
                  setIsResizing(true);
                  setIsDragingDot(true);
                  if (props.onDragStart) props.onDragStart();
                }}
                onDrag={({ movement: [x, y] }) => {
                  const oldBoundaries = info.boundaries || [];
                  let bdr = [...boundaries];
                  const movementVector = new THREE.Vector3(x, y, 0);
                  const movementProjectVector = movementVector
                    .clone()
                    .projectOnVector(
                      new THREE.Vector3(
                        oldBoundaries[nextIndex][0] - oldBoundaries[i][0],
                        oldBoundaries[nextIndex][1] - oldBoundaries[i][1],
                        0
                      )
                    );
                  // console.log(movementVector,movementProjectVector)
                  const movementPTVector = (movementProjectVector.negate()).add(movementVector)
                  const prevCPVector = new THREE.Vector3(oldBoundaries[i][0] - oldBoundaries[prevIndex][0],oldBoundaries[i][1] - oldBoundaries[prevIndex][1],0)
                  const nextCPVector = new THREE.Vector3(oldBoundaries[nextIndex][0] - oldBoundaries[next2Index][0],oldBoundaries[nextIndex][1] - oldBoundaries[next2Index][1],0)
                  const prevMovementProjectVector = movementPTVector.clone().projectOnVector(prevCPVector)
                  const nextMovementProjectVector = movementPTVector.clone().projectOnVector(nextCPVector)
                  bdr[i] = [oldBoundaries[i][0] + prevMovementProjectVector.x, oldBoundaries[i][1] + prevMovementProjectVector.y];
                  bdr[nextIndex] = [
                    oldBoundaries[nextIndex][0] + nextMovementProjectVector.x,
                    oldBoundaries[nextIndex][1] + nextMovementProjectVector.y,
                  ];

                  setBoundaries(bdr);
                  if (props.onDrag) {
                    props.onDrag({
                      ...info,
                      boundaries: boundaries,
                      wallBoundaries: getWallBoundaries(),
                    });
                  }
                }}
                onDragEnd={() => {
                  setIsResizing(false);
                  setIsDragingDot(false);
                  if (props.onDragEnd) {
                    props.onDragEnd({ ...info, boundaries: boundaries,wallBoundaries: getWallBoundaries() });
                  }
                }}
              />
            )}
            {/* Green light when active */}
            {
              active == true &&
              <mesh>
                <meshLineGeometry points={[
                  point.clone().setZ(0.015),nextPoint.clone().setZ(0.1)
                ]} />
                <meshLineMaterial 
                  transparent 
                  lineWidth={0.15 * 50 / factor} 
                  color={'#59b259'} 
                  opacity={0.7}
                  depthWrite={true}
                  toneMapped={true} 
                />
              </mesh>
            }
          </>
        );
      })}

      {active == true && !lock && !enable3D && (
        <>
          {boundaries.map((boundary, i) => {
            return (
              <Dot
                key={i}
                visible={!isResizing && !isDraging && !rotating}
                position={boundary}
                onDragStart={() => {
                  // console.log('aads')
                  setIsResizing(true);
                  setIsDragingDot(true);
                  if (props.onDragStart) props.onDragStart();
                }}
                onDrag={({ offset: [x, y], initial }) => {
                  let bdr = [...boundaries];
                  bdr[i] = [x, y];
                  // Check 180° with two near point in Boundary
                  let point = new THREE.Vector3(x,y,0)
                  const prevIndex2 = (i - 2 + boundaries.length) % boundaries.length
                  const prevIndex = (i - 1 + boundaries.length) % boundaries.length
                  const nextIndex = (i + 1) % boundaries.length
                  const nextIndex2 = (i + 2) % boundaries.length
                  const prevPoint = new THREE.Vector3(boundaries[prevIndex][0],boundaries[prevIndex][1],0)
                  const nextPoint = new THREE.Vector3(boundaries[nextIndex][0],boundaries[nextIndex][1],0)
                  const angle = prevPoint.clone().sub(point).angleTo(nextPoint.clone().sub(point))
                  const prevPoint2 = new THREE.Vector3(boundaries[prevIndex2][0],boundaries[prevIndex2][1],0)
                  const nextPoint2 = new THREE.Vector3(boundaries[nextIndex2][0],boundaries[nextIndex2][1],0)
                  const angle2 = prevPoint.clone().sub(prevPoint2).angleTo(prevPoint.clone().sub(point))
                  
                  // Nếu lớn hơn 175° hoặc nhỏ hơn 5° 2 điểm gần kề
                  if (angle < Math.PI/18 || angle > Math.PI * 34/36) {
                    const newVectorProject = new THREE.Vector3(
                      point.x - prevPoint.x,
                      point.y - prevPoint.y,
                      0
                    ).projectOnVector(nextPoint.clone().sub(prevPoint));
                    
                    const newPosition = newVectorProject.clone().add(
                      new THREE.Vector3(prevPoint.x, prevPoint.y, 0)
                    );
                    bdr[i] = [newPosition.x, newPosition.y];
                  }else if(angle2 < Math.PI * 10/180 || angle2 > Math.PI * 170/180){
                    // Nếu lớn hơn 175° hoặc nhỏ hơn 5° 2 đường gần kề prev
                    // console.log('aa')
                    const newVectorProject = new THREE.Vector3(
                      point.x - prevPoint.x,
                      point.y - prevPoint.y,
                      0
                    ).projectOnVector(prevPoint2.clone().sub(prevPoint));
                    
                    const newPosition = newVectorProject.clone().add(
                      new THREE.Vector3(prevPoint.x, prevPoint.y, 0)
                    );
                    bdr[i] = [newPosition.x, newPosition.y];
                  }else if(angle2 > Math.PI * 85/180 && angle2 < Math.PI * 95/180){
                    // Nếu lớn hơn 85° hoặc nhỏ hơn 95° 2 đường gần kề prev
                    
                    const line = prevPoint2.clone().sub(prevPoint)
                    const x = line.y;
                    const y = -line.x
                    line.setX(x)
                    line.setY(y)
                    // console.log(line.x,line.y,'bbb')
                    const newVectorProject = new THREE.Vector3(
                      point.x - prevPoint.x,
                      point.y - prevPoint.y,
                      0
                    ).projectOnVector(line);
                    
                    const newPosition = newVectorProject.clone().add(
                      new THREE.Vector3(prevPoint.x, prevPoint.y, 0)
                    );
                    bdr[i] = [newPosition.x, newPosition.y];
                  }
                  point = new THREE.Vector3(bdr[i][0],bdr[i][1],0)
                  const angle3 = nextPoint.clone().sub(nextPoint2).angleTo(nextPoint.clone().sub(point))
                  if(angle3 < Math.PI * 10/180 || angle3 > Math.PI * 170/180){
                    
                    // Nếu lớn hơn 175° hoặc nhỏ hơn 5° 2 đường gần kề next
                    // console.log('bb')
                    const newVectorProject = new THREE.Vector3(
                      point.x - nextPoint.x,
                      point.y - nextPoint.y,
                      0
                    ).projectOnVector(nextPoint2.clone().sub(nextPoint));
                    
                    const newPosition = newVectorProject.clone().add(
                      new THREE.Vector3(nextPoint.x, nextPoint.y, 0)
                    );
                    bdr[i] = [newPosition.x, newPosition.y];
                  }else if(angle3 > Math.PI * 85/180 && angle3 < Math.PI * 95/180){
                    // Nếu lớn hơn 85° hoặc nhỏ hơn 95° 2 đường gần kề prev
                    
                    const line = nextPoint2.clone().sub(nextPoint)
                    const x = line.y;
                    const y = -line.x
                    line.setX(x)
                    line.setY(y)
                    // console.log(line.x,line.y,'bbb')
                    const newVectorProject = new THREE.Vector3(
                      point.x - nextPoint.x,
                      point.y - nextPoint.y,
                      0
                    ).projectOnVector(line);
                    
                    const newPosition = newVectorProject.clone().add(
                      new THREE.Vector3(nextPoint.x, nextPoint.y, 0)
                    );
                    bdr[i] = [newPosition.x, newPosition.y];
                  }
                  
                  setBoundaries(bdr);
                  if (props.onDrag) {
                    props.onDrag({
                      ...info,
                      boundaries: boundaries,
                      wallBoundaries: getWallBoundaries(),
                      boundariesBefore: info.boundaries,
                    });
                  }
                }}
                onDragEnd={() => {
                  setIsResizing(false);
                  setIsDragingDot(false);
                  if (props.onDragEnd) {
                    
                    props.onDragEnd({ 
                      ...info, 
                      boundaries: boundaries,
                      wallBoundaries: getWallBoundaries()
                    });
                  }
                }}
              />
            );
          })}
        </>
      )}
      <group>
        {renderWall()}
        <mesh
          ref={containerRef}
          {...bind()}
          onClick={() => {
            props.onFocus();
          }}>
          <shapeGeometry args={[roundedRect()]} />
          <meshBasicMaterial
            attach="material"
            color={"#d9d4ad"}
            transparent
            sizes={0.3}
            opacity={0.4}
          />
        </mesh>
        {/* {props.children || ''} */}
        <Rulers
          isDraging={isDraging}
          isResizing={isResizing}
          rotating={rotating}
          center={centroid}
          info={info}
          boundaries={boundaries}
          position={positions}
          boundaryCollection={props.boundaryCollection}
        />
      </group>
      {/* Rotate Dot */}
      {active == true && !enable3D && !lock && !isResizing && !isDraging && (
        <Rotator 
          info={info}
          rotating={rotating}
          centroid={centroid}
          boundaries={boundaries}
          onRotateStart={() => {
            setRotating(true);
            if (props.onRotateStart) props.onRotateStart()
          }}
          onRotate={(angle) => {
            let bdr = [...info.boundaries]
            bdr.map((item,i) => {
              const aa = new THREE.Vector3(item[0],item[1],centroid.z).sub(centroid).applyAxisAngle(new THREE.Vector3(0,0,1),angle).add(centroid)
              bdr[i] = [aa.x,aa.y]
            })
            // console.log(bdr)
            setBoundaries(bdr)
            if (props.onRotate) props.onRotate({
              ...info,
              boundaries: boundaries,
              wallBoundaries: getWallBoundaries(),
              rotation: [0,0,angle]
            })
          }}
          onRotateEnd={(angle) => {
            setRotating(false);
            if (props.onRotateEnd) props.onRotateEnd({
              ...info,
              boundaries: boundaries,
              wallBoundaries: getWallBoundaries(),
              rotation: [0,0,angle]
            })
          }}
        />
      )}
    </>
  );
});
function Rotator(props){
  const info = props.info || {}
  const rotating = props.rotating
  const centroid = props.centroid
  const boundaries = props.boundaries || []
  const [rotateAngle, setRotateAngle] = React.useState(0);
  
  // let maxDistancePoint = 3
  const maxDistancePoint = Math.max.apply(Math, boundaries.map(function(o) { return new THREE.Vector3(o[0],o[1],0).sub(centroid).length(); }))
  // boundaries.map(item=>{
  //   const newLength = new THREE.Vector3(item[0],item[1],0).sub(centroid).length()
  //   console.log(newLength)
  //   if (maxDistancePoint < newLength) {
  //     maxDistancePoint = newLength
  //   }
  // })
  // console.log(maxDistancePoint)
  const dotQuayPoint = new THREE.Vector3(0, -maxDistancePoint - 1, 0).add(centroid)
  const lineGeometryToRotatePoint = new THREE.BufferGeometry().setFromPoints([
    centroid, dotQuayPoint
  ]);
  const font = new FontLoader().parse(Roboto);
  return(
    <>
      <Dot
        position={[dotQuayPoint.x,dotQuayPoint.y,0.01]}
        visible={!rotating}
        imageURL={"/images/rotate-icon.png"}
        onDragStart={() => {
          if (props.onRotateStart) props.onRotateStart()
        }}
        onDrag={(event) => {
          const offset = event.offset
          const centroid = Helper.getPolygonCentroid(info.boundaries || [])
          // const offsetPoint = new THREE.Vector2(
          //   offset[0] - info.position[0],
          //   offset[1] - info.position[1]
          // );
          // const angle = offsetPoint.angleTo(new THREE.Vector2(0,1)).toFixed(2)

          // let angle = Math.atan2(offset[1] - info.position[1], offset[0] - info.position[0]) - Math.atan2(offset[1] - info.position[1], 0);
          // angle = (angle < 0 ? Math.PI * 2 + angle : angle).toFixed(2)
          
          let degree = Helper.caculateDegreeFromTwoPointFollowYAxis(
            offset[0],
            offset[1],
            centroid[0],
            centroid[1]
          );
          if (degree > 360) {
            degree = degree - 360
          }
          // const degrees = THREE.MathUtils.radToDeg(quaternion.angleTo(quaternion1));
          // console.log(oldDegree)
          let angle = (degree * Math.PI) / 180;
          // if (degree <= 5 || degree > 355) {
          //   angle = 0
          // }else if(degree >= 85 && degree <= 95 ){
          //   angle = Math.PI/2
          // }
          setRotateAngle(angle)
          if (props.onRotate) props.onRotate(angle)
        }}
        onDragEnd={() => {
          if (props.onRotateEnd) props.onRotateEnd(rotateAngle)
        }}
      />
      <line
        geometry={lineGeometryToRotatePoint}
        visible={!rotating}
        onUpdate={(line) => line.computeLineDistances()}>
        <lineDashedMaterial
          attach="material"
          color="#000"
          dashSize={0.2}
          gapSize={0.2}
        />
      </line>
      {rotating && (
        <mesh position={centroid}>
          <textGeometry
            args={[
              Math.round((rotateAngle * 180) / Math.PI) + "°",
              { font, size: 0.4, height: 0.02 },
            ]}
          />
          <meshPhongMaterial attach="material" color={"#000"} />
        </mesh>
      )}
    </>
  )
}
function Rulers(props) {
  const isDraging = props.isDraging
  const isResizing = props.isResizing
  const rotating = props.rotating
  const info = props.info || {};
  const boundaries = props.boundaries || [];
  const area = Helpers.calcPolygonArea(boundaries).toFixed(2);
  // const center = props.center;
  const ceter2 = Helper.getPolygonCentroid(boundaries);
  // console.log(ceter2,boundaries)
  const center2 = new THREE.Vector3(ceter2[0],ceter2[1])
  const font = new FontLoader().parse(Roboto);
  
  return (
    <>
      {center2 && center2.x && !isDraging && !rotating &&(
        <>
          <mesh position={[center2.x, center2.y, 0.01]}>
            <textGeometry
              args={[area + "m2", { font, size: 0.5, height: 0.03 }]}
            />
            <meshPhongMaterial attach="material" color={"#000"} />
          </mesh>
          <mesh position={[center2.x, center2.y, 0.01]}>
            <circleGeometry
              args={[0.1,10]}
            />
            <meshBasicMaterial attach="material" color={"red"} />
          </mesh>
        </>
      )}
      {/* Hiển thị Góc */}
      {
        isResizing && Array.isArray(boundaries) && boundaries.length >= 3 &&
        <>
          {boundaries.map((boundary, i) => {
            const prevIndex = (i - 1 + boundaries.length) % boundaries.length
            const nextIndex = (i + 1) % boundaries.length
            const prevPoint = new THREE.Vector3(boundaries[prevIndex][0],boundaries[prevIndex][1],0)
            const nextPoint = new THREE.Vector3(boundaries[nextIndex][0],boundaries[nextIndex][1],0)
            const point = new THREE.Vector3(boundary[0],boundary[1],0)
            const angle = prevPoint.clone().sub(point).angleTo(nextPoint.clone().sub(point))
            const textPoint = point.clone().add(prevPoint.clone().sub(point).add(nextPoint.clone().sub(point)).setLength(1))
            const is90degree = Math.round(angle * 100)/100 == Math.round(Math.PI * 100/2)/100 || 
                                Math.round(angle * 100)/100 == Math.round(Math.PI * 100)/100
            if (is90degree) {
              const line1 = prevPoint.clone().sub(point).setLength(1.5)
              const line2 = nextPoint.clone().sub(point).setLength(1.5)
              // const po1 = point.clone().add(line1)
              // const po2 = point.clone().add(line2)
              let po3 = line1.clone().add(line2).setLength(1.5).add(point)
              if (Math.round(angle * 100)/100 == Math.round(Math.PI * 100)/100) {
                const line3 = line1.clone().setX(-line1.y).setY(line1.x)
                po3 = line3.add(point)
              }
              var path = new THREE.SplineCurve([
                point.clone().add(line1),
                // po3.clone().sub(point).applyAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/6).add(point),
                po3,
                // po3.clone().sub(point).applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4).add(point),
                point.clone().add(line2),
              ]);
              var points = path.getPoints(50);
              // console.log(po3)
            }
            return (
              <>
                <mesh
                  position={[textPoint.x, textPoint.y, 0]}>
                  <textGeometry
                    args={[(angle * 180 / Math.PI).toFixed(1) + '°', { font, size: 0.3, height: 0.05 }]}
                  />
                  <meshPhongMaterial attach="material" color={"#000"} />
                </mesh>
                {
                  is90degree &&
                  <mesh>
                    <meshLineGeometry points={points} />
                    <meshLineMaterial 
                      transparent 
                      lineWidth={0.1} 
                      color={'#59b259'} 
                      opacity={0.7}
                      dashArray={0.1}
                      dashRatio={0.5}
                    />
                  </mesh>
                }
              </>
            )
          })}
        </>
      }
      {/* Hiển thị độ dài */}
      {
        !isDraging && !rotating &&
        <>
          {boundaries.map((boundary, i) => {
            const nextIndex = (i + 1) % boundaries.length;
            const nextBoundary = boundaries[nextIndex];
            let vtpt = [
              boundary[1] - nextBoundary[1],
              nextBoundary[0] - boundary[0],
            ];

            vtpt = new THREE.Vector3(vtpt[0],vtpt[1],0);
            const length = (new THREE.Vector2(boundary[1] - nextBoundary[1],nextBoundary[0] - boundary[0],)).length().toFixed(2);
            vtpt.setLength(RulerDistance);
            const start = new THREE.Vector3(
              boundary[0] + vtpt.x,
              boundary[1] + vtpt.y,
              0
            );
            const end = new THREE.Vector3(
              nextBoundary[0] + vtpt.x,
              nextBoundary[1] + vtpt.y,
              0
            );
            const vertices = [start, end];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
            const vertices1 = [
              new THREE.Vector3(
                start.x - (vtpt.x * RulerDistance) / 4,
                start.y - (vtpt.y * RulerDistance) / 4,
                0
              ),
              new THREE.Vector3(
                start.x + (vtpt.x * RulerDistance) / 4,
                start.y + (vtpt.y * RulerDistance) / 4,
                0
              ),
            ];
            const lineGeometry1 = new THREE.BufferGeometry().setFromPoints(
              vertices1
            );

            const vertices2 = [
              new THREE.Vector3(
                end.x - (vtpt.x * RulerDistance) / 4,
                end.y - (vtpt.y * RulerDistance) / 4,
                0.01
              ),
              new THREE.Vector3(
                end.x + (vtpt.x * RulerDistance) / 4,
                end.y + (vtpt.y * RulerDistance) / 4,
                0.01
              ),
            ];
            const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(
              vertices2
            );
            const textPosition = start.add(end).divideScalar(2);
            const textAngle = vtpt.angleTo(new THREE.Vector3(0, 1, 0));
            return (
              <>
                {/* // Line goc dau  */}

                <line geometry={lineGeometry1} key={i}>
                  <lineBasicMaterial attach="material" color="#000" />
                </line>
                {/* Line thang */}
                <line geometry={lineGeometry}>
                  <lineBasicMaterial attach="material" color="#000" />
                </line>
                {/* Line goc cuoi */}
                <line geometry={lineGeometry2}>
                  <lineBasicMaterial attach="material" color="#000" />
                </line>
                <mesh
                  position={[textPosition.x, textPosition.y, 0]}
                  rotation={[0, 0, textAngle]}>
                  <textGeometry
                    args={[length, { font, size: 0.3, height: 0.02 }]}
                  />
                  <meshPhongMaterial attach="material" color={"#000"} />
                </mesh>
              </>
            );
          })}
          
        </>
      }
    </>
  );
}

export default Room;
