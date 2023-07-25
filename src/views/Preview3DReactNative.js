import React from 'react'

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Preview3D( props ){
  const data = props.data || []

  return (
    <>
      <Canvas className="canvas" style={{width: '100vw',height: '100vh'}}>
        <Box />
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        {/*  */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </>
  )
}

function Box() {
  return (
    <mesh>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="blue" />
    </mesh>
  );
}

export default Preview3D
