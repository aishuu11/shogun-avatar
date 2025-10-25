"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Avatar from "./Avatar";

export default function Scene() {
  return (
    <div className="h-[60vh] w-full rounded-2xl overflow-hidden border">
      <Canvas camera={{ position: [0, 1.4, 1.5], fov: 35 }}>
        <hemisphereLight intensity={0.6} />
        <directionalLight position={[2, 3, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Avatar />
        </Suspense>
        <OrbitControls enableDamping target={[0, 1.4, 0]} />
      </Canvas>
    </div>
  );
}
