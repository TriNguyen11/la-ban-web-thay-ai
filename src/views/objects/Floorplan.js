import React, { useRef, useState, useEffect, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { Components, APIs, Helper } from "@floorplan/App";

import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import Roboto from "@floorplan/fonts/Roboto_Regular.json";

import {
  useGLTF,
  OrbitControls,
  useTexture,
  PivotControls,
} from "@react-three/drei";
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";

extend({ TextGeometry, MeshLineGeometry, MeshLineMaterial });

import Dot from "./Dot";

const distanceDot = 1.4;

const Floorplan = React.forwardRef((props, ref) => {
  const priority = 1;
  const boundaryCollection = props.boundaryCollection || []
  const info = props.info || {};
  const [position, setPosition] = React.useState(info.position || [0,0,0]);
  const [rotation, setRotation] = React.useState(info.rotation || [0, 0, 0]);

  const enable3D = props.enable3D || false;
  const [length, setLength] = React.useState(info.length);
  const [width, setWidth] = React.useState(info.width);
  const [height, setHeight] = React.useState(info.height);
  const [boundaries, setBoundaries] = React.useState(info.boundaries || []);
  const { size,viewport,camera } = useThree();
  const { factor,aspect } = viewport;
  // console.log(factor)
  // console.log(factor,viewport.width - Math.max(Math.abs(camera.position.x),Math.abs(camera.position.y)) * aspect)
  const active = props.active || false
  const lock = info.lock || false;
  const [rotating, setRotating] = React.useState(false);
  const [loadImageError, setLoadImageError] = React.useState(false);
  const [imageIsLoaded, setImageIsLoaded] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDraging, setIsDraging] = React.useState(false);
  React.useEffect(() => {
    const ifo = props.info || {};
    setPosition(ifo.position);
    setRotation(ifo.rotation);
    setLength(ifo.length);
    setWidth(ifo.width);
    setHeight(ifo.height);
  }, [props.info]);
  React.useImperativeHandle(ref, () => ({
    priority: priority,
    setPosition: (po) => {
      setPosition(po);
    },
    setRotation: setRotation,
  }));
  const computedBoundaries = (data) => {
    const position = data.position || [0,0,0]
    const rotation = data.rotation || [0,0,0]
    const length = data.length
    const width = data.width
    let trentrai = new THREE.Vector3(position[0] - length / 2, position[1] + width / 2,0);
    let trenphai = new THREE.Vector3(position[0] + length / 2, position[1] + width / 2,0)
    let duoiphai = new THREE.Vector3(position[0] + length / 2, position[1] - width / 2,0)
    let duoitrai = new THREE.Vector3(position[0] - length / 2, position[1] - width / 2,0)
    const po = new THREE.Vector3(position[0],position[1],0);
    trentrai.sub(po).applyAxisAngle(new THREE.Vector3(0,0,1),rotation[2]).add(po)
    duoiphai.sub(po).applyAxisAngle(new THREE.Vector3(0,0,1),rotation[2]).add(po)
    duoitrai.sub(po).applyAxisAngle(new THREE.Vector3(0,0,1),rotation[2]).add(po)
    trenphai.sub(po).applyAxisAngle(new THREE.Vector3(0,0,1),rotation[2]).add(po)
    return [
      [trentrai.x,trentrai.y], //Tren
      [trenphai.x,trenphai.y], //Phai
      [duoiphai.x,duoiphai.y], //Duoi
      [duoitrai.x,duoitrai.y], //Trai
    ]
  }
  const bind = useGesture(
    {
      onDragStart: () => {
        setIsDraging(true)
        if (props.onDragStart) props.onDragStart()
      },
      onDrag: ({ offset: [x, y], timeStamp, event }) => {
        if (!active) {
          onFocus();
          return;
        }
        let po = [x, y, 0]
        // Tìm đường thẳng gần nhất.
        let dragingBoundaries = computedBoundaries({
          position: po,
          rotation: rotation,
          length: length,
          width: width,
        })

        // boundaryCollection.map((boundaries,key) => {
        //   boundaries.map((point,key2) => {
        //     const j = (key2 + 1) % boundaries.length;
        //     const point1 = new THREE.Vector3(point[0],point[1],0); 
        //     const point2 = new THREE.Vector3(boundaries[j][0],boundaries[j][1],0);
        //     dragingBoundaries.map((dr,key3) => {
        //       const point = new THREE.Vector3(dr[0],dr[1],0); 
        //       if (condition) {
                
        //       }
        //     })
        //   })
        // })

        setPosition(po);
        setBoundaries(dragingBoundaries)
        if (props.onDrag) {
          props.onDrag({
            ...info,
            position: po,
            boundaries: boundaries
          });
        }
      },
      onDragEnd: ({ delta: [x, y] }) => {
        setIsDraging(false)
        if (props.onDragEnd) {
          props.onDragEnd({
            ...info,
            position: position,
            length: length,
            width: width,
            boundaries: boundaries
          });
        }
      },
      onHover: ({ hovering }) => {},
    },
    {
      enabled: active && !lock,
      eventOptions: { passive: false },
      drag: {
        from: () => [position[0], position[1]],
      },
      transform: ([x, y]) => [Math.round(x * 100 / factor) / 100, - Math.round(y * 100 / factor) / 100 ],
    }
  );
  const image = useMemo(
    () =>
      new THREE.TextureLoader().load(
        info.image,
        () => {
          // On onLoad
          setImageIsLoaded(true);
        },
        () => {
          // On onProgress
        },
        () => {
          // On Error
          setLoadImageError(true);
        }
      ),
    [info.image]
  );
  // console.log(info, "check info");
  if (enable3D) {
    if (info.image3d) {
      try {
        const gltf = <Object3D info={info} />;
        // const gltf = useGLTF(info.image3d)
        return gltf;
      } catch (er) {}
    }

    return (
      <mesh
        position={position}
        rotation={rotation}
        // {...bind()}
      >
        <boxGeometry attach="geometry" args={[length, width, height]} />
        <meshBasicMaterial
          attach="material"
          map={image}
          reflectivity={1}
          // transparent
        />
      </mesh>
    );
  }
  // console.log(info.image)
  const centerPoint = new THREE.Vector3(position[0], position[1], 0);
  const dotPoints = [
    [0, 0 + width / 2 + distanceDot, 0.02], //Tren
    [0 + length / 2 + distanceDot / 2, 0, 0.02], //Phai
    [0, 0 - width / 2 - distanceDot, 0.02], //Duoi
    [0 - length / 2 - distanceDot / 2, 0, 0.02], //Trai
  ];
  const vertices = [
    // Tren
    [
      new THREE.Vector3(-length / 2, -width / 2, 0.01),
      new THREE.Vector3(length / 2, -width / 2, 0.01),
    ],
    // Phai
    [
      new THREE.Vector3(length / 2, -width / 2, 0.01),
      new THREE.Vector3(length / 2, width / 2, 0.01),
    ],
    // Duoi
    [
      new THREE.Vector3(length / 2, width / 2, 0.01),
      new THREE.Vector3(-length / 2, width / 2, 0.01),
    ],
    // Trai
    [
      new THREE.Vector3(-length / 2, width / 2, 0.01),
      new THREE.Vector3(-length / 2, -width / 2, 0.01),
    ],
  ];
  const dotQuayPoint = [
    position[0],
    position[1] - width / 2 - 1.3 - distanceDot,
    0.02,
  ];
  const lineGeometryToRotatePoint = new THREE.BufferGeometry().setFromPoints([
    centerPoint,
    new THREE.Vector3(dotQuayPoint[0], dotQuayPoint[1], 0.01),
  ]);
  const font = new FontLoader().parse(Roboto);
  return (
    <>
      <group position={position} rotation={rotation}>
        {(!imageIsLoaded || loadImageError) && (
          <>
            <mesh>
              <planeGeometry attach="geometry" args={[length, width]} />
              <meshBasicMaterial attach="material" color="gray" transparent />
            </mesh>
            {vertices.map((vertice, i) => {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(
                vertice
              );
              return (
                <line geometry={lineGeometry} key={i}>
                  <lineBasicMaterial attach="material" color="#000" />
                </line>
              );
            })}
          </>
        )}
        <mesh
          {...bind()}
          onClick={(e) => {
            props.onFocus();
          }}>
          <planeGeometry attach="geometry" args={[length, width]} />
          <meshBasicMaterial
            // attach="material"
            map={image}
            // map-flipY={true}
            transparent
          />
        </mesh>
        {/* Green light when active */}
        {active == true && (
          <>
            {vertices.map((vertice, i) => {
              // const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertice);
              return (
                <mesh>
                  <meshLineGeometry points={vertice} />
                  <meshLineMaterial
                    transparent
                    lineWidth={(0.15 * 50) / factor}
                    color={"#59b259"}
                    opacity={0.7}
                    depthWrite={true}
                    toneMapped={true}
                  />
                </mesh>
              );
            })}
          </>
        )}
        {active == true && !enable3D && !lock && !rotating && (
          <>
            {dotPoints.map((point, i) => {
              let image = "/images/2-arrow.png";

              let rota = [0, 0, 0];
              if (i == 0) {
                // Tren
                rota = [0, 0, Math.PI / 2];
              } else if (i == 1) {
                // Phai
              } else if (i == 2) {
                // Duoi
                rota = [0, 0, Math.PI / 2];
              } else if (i == 3) {
                // Trai
              }
              const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(point[0], point[1], -0.01),
              ]);
              return (
                <>
                  <Dot
                    visible={!isResizing && !isDraging}
                    position={point}
                    rotation={rota}
                    imageURL={image}
                    onDragStart={() => {
                      setIsResizing(true)
                      if (props.onDragStart) props.onDragStart()
                    }}
                    onDrag={({ delta: [x, y], offset }) => {
                      let ifa = { ...info, length: length, width: width };
                      const aa = new THREE.Vector3(x, y, 0);
                      const oldLength = ifa.length;
                      const oldWidth = ifa.width;
                      if (i == 0) {
                        // Tren
                        const changeDistance = (y >= 0 ? 1 : -1) * aa.length().toFixed(2);
                        ifa.width += changeDistance;
                      } else if (i == 1) {
                        // Phai
                        const changeDistance =
                          (x >= 0 ? 1 : -1) * aa.length().toFixed(2);
                        ifa.length += changeDistance;
                      } else if (i == 2) {
                        // Duoi
                        const changeDistance = (y <= 0 ? 1 : -1) * aa.length().toFixed(2);
                        ifa.width += changeDistance;
                      } else if (i == 3) {
                        // Trai
                        const changeDistance =
                          (x <= 0 ? 1 : -1) * aa.length().toFixed(2);
                        ifa.length += changeDistance;
                      }
                      // Duy trì tỉ lệ
                      if (ifa.maintainRatio) {
                        if (oldLength != ifa.length) {
                          ifa.width = (ifa.length * oldWidth) / oldLength;
                        } else if (oldWidth != ifa.width) {
                          ifa.length = (ifa.width * oldLength) / oldWidth;
                        }
                      }
                      ifa.boundaries = computedBoundaries(ifa)
                      setLength(Math.round(ifa.length * 100) / 100);
                      setWidth(Math.round(ifa.width * 100) / 100);
                      setBoundaries(ifa.boundaries)
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
                          boundaries: boundaries
                        });
                      }
                    }}
                  />
                  {
                    !isResizing && !isDraging &&
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
                  }
                </>
              );
            })}
          </>
        )}
      </group>
      {/* Rotate Dot */}
      {active == true && !enable3D && !lock && !isResizing && !isDraging && (
        <>
          <Dot
            position={dotQuayPoint}
            visible={!rotating}
            imageURL={"/images/rotate-icon.png"}
            onDragStart={() => {
              setRotating(true);
              if (props.onDragStart) props.onDragStart()
            }}
            onDrag={({ offset }) => {
              const offsetPoint = new THREE.Vector2(
                offset[0] - info.position[0],
                offset[1] - info.position[1]
              );
              // const angle = offsetPoint.angleTo(new THREE.Vector2(0,1)).toFixed(2)

              // let angle = Math.atan2(offset[1] - info.position[1], offset[0] - info.position[0]) - Math.atan2(offset[1] - info.position[1], 0);
              // angle = (angle < 0 ? Math.PI * 2 + angle : angle).toFixed(2)
              let degree = Helper.caculateDegreeFromTwoPointFollowYAxis(
                offset[0],
                offset[1],
                info.position[0],
                info.position[1]
              );
              const oldAngle = Array.isArray(info.rotation) && info.rotation.length ==3 ? info.rotation[2] : 0
              const oldDegree = oldAngle * 180 / Math.PI
              degree = oldDegree + degree
              if (degree > 360) {
                degree = degree - 360
              }
              // const degrees = THREE.MathUtils.radToDeg(quaternion.angleTo(quaternion1));
              // console.log(oldDegree)
              let angle = (degree * Math.PI) / 180;
              if (degree <= 5 || degree > 355) {
                angle = 0
              }else if(degree >= 85 && degree <= 95 ){
                angle = Math.PI/2
              }
              setRotation([0, 0, angle]);

              const dragingBoundaries = computedBoundaries({...info, rotation: [0, 0, angle]})
              setBoundaries(dragingBoundaries)
              if (props.onDrag) {
                props.onDrag({ ...info, rotation: [0, 0, angle],boundaries: dragingBoundaries });
              }
            }}
            onDragEnd={() => {
              setRotating(false);
              if (props.onDragEnd) {
                props.onDragEnd({
                  ...info,
                  position: position,
                  rotation: rotation,
                  length: length,
                  width: width,
                  height: height,
                  boundaries: boundaries
                });
              }
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
            <mesh position={position}>
              <textGeometry
                args={[
                  Math.round((rotation[2] * 180) / Math.PI) + "°",
                  { font, size: 0.3, height: 0.02 },
                ]}
              />
              <meshPhongMaterial attach="material" color={"#000"} />
            </mesh>
          )}
        </>
      )}
    </>
  );
});

function Object3D(props) {
  const info = props.info || {};
  const position = info.position;
  const gltf = useGLTF(info.image3d);
  // const gltf = useGLTF('/images/3D_G1800X2000_Gường đệm 1m8 x 2m.gltf');
  return (
    <primitive
      object={gltf.scene}
      position={position}
      scale={[info.length, info.width, info.height]}
      // rotation={[0,Math.PI/2,0]}
    />
  );
}

export default Floorplan;
