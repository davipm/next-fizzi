"use client";

import gsap from "gsap";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Renders an animated group of 3D bubbles using instanced meshes and GSAP for randomization.
 *
 * @param count Number of bubbles to render.
 * @param speed Base speed for bubble movement.
 * @param bubbleSize Size of each bubble.
 * @param opacity Opacity of the bubbles.
 * @param repeat Whether bubbles should loop when reaching the top.
 *
 * Bubbles float upwards, reset position when reaching a threshold, and adapt color to the document background.
 */

type BubbleProps = {
  count?: number;
  speed?: number;
  bubbleSize?: number;
  opacity?: number;
  repeat?: boolean;
};

export default function Bubbles({
  count = 300,
  speed = 5,
  bubbleSize = 0.05,
  opacity = 0.5,
  repeat = true,
}: BubbleProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bubbleSpeed = useRef<Float32Array>(new Float32Array(count));
  const minSpeed = speed * 0.001;
  const maxSpeed = speed * 0.005;

  // Shared Object3D for matrix operations
  const o = useRef(new THREE.Object3D()).current;

  // Geometry and material are memoized to avoid recreation on each render
  const geometry = useMemo(
    () => new THREE.SphereGeometry(bubbleSize, 16, 16),
    [bubbleSize],
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        transparent: true,
        opacity,
      }),
    [opacity],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      o.position.set(
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4),
      );
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      bubbleSpeed.current[i] = gsap.utils.random(minSpeed, maxSpeed);
    }
    mesh.instanceMatrix.needsUpdate = true;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [count, minSpeed, maxSpeed, geometry, material, o]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Dynamically update bubble color to match background
    material.color.setStyle(document.body.style.backgroundColor);

    for (let i = 0; i < count; i++) {
      mesh.getMatrixAt(i, o.matrix);
      o.position.setFromMatrixPosition(o.matrix);
      o.position.y += bubbleSpeed.current[i];

      if (o.position.y > 4 && repeat) {
        o.position.y = -2;
        o.position.x = gsap.utils.random(-4, 4);
        o.position.z = gsap.utils.random(0, 8);
      }

      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      position={[0, 0, 0]}
    />
  );
}
