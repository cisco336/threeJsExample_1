import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Environment } from "drei"
import { Box } from "@react-three/drei/shapes";
import "./styles.css";

const Scene = () => {
  const scene = useRef();
  useFrame(() => {
    scene.current.rotation.y += 0.004;
    scene.current.rotation.x += 0.004;
    scene.current.rotation.z += 0.004;
  });
  return (
    <group
      ref={scene}
      scale={[1,1,1]}
      >
      <Box>
        <meshLambertMaterial attach="material" color="blue" />
      </Box>
    </group>
  );
};

export default function Cube() {
  return (
    <Canvas id="theCube">
      <directionalLight intensity={0.5} />
      <Suspense fallback={null}>
        <Environment files="royal_esplanade_1k.hdr" />
      </Suspense>
      <Scene />
    </Canvas>
  );
}
