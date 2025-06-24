"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { CSSProperties, Suspense } from "react";
import dynamic from "next/dynamic";

const Loader = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Loader),
  { ssr: false },
);

const styles: CSSProperties = {
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 30,
};

export default function ViewCanvas() {
  return (
    <>
      <Canvas
        style={styles}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{ fov: 30 }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
