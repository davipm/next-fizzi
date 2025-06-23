"use client";

import gsap from "gsap";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useMemo, useRef } from "react";
import { Content } from "@prismicio/client";
import { useGSAP } from "@gsap/react";

import { Cloud, Clouds, Environment } from "@react-three/drei";
import FloatingCan from "@/components/floating-can";
import ThreeText from "@/components/three-text";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

/**
 * Renders an animated 3D scene with a floating can, clouds, and text using THREE.js and GSAP.
 * Handles entrance, looping, and scroll-triggered animations for scene elements.
 *
 * @param sentence - The text to display in the scene.
 * @param flavor - The flavor data for the can component.
 * @returns A group containing the animated 3D scene elements.
 */
export default function Scene({ sentence, flavor }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  const ANGLE = useMemo(() => 75 * (Math.PI / 180), []);

  const getXPosition = useCallback(
    (distance: number) => {
      return distance * Math.cos(ANGLE);
    },
    [ANGLE],
  );

  const getYPosition = useCallback(
    (distance: number) => {
      return distance * Math.sin(ANGLE);
    },
    [ANGLE],
  );

  const getXYPositions = useCallback(
    (distance: number) => {
      return {
        x: getXPosition(distance),
        y: getYPosition(-1 * distance),
      };
    },
    [getXPosition, getYPosition],
  );

  useGSAP(() => {
    if (
      !cloud1Ref.current ||
      !canRef.current ||
      !wordsRef.current ||
      !cloudsRef.current ||
      !cloud2Ref.current
    ) {
      return null;
    }

    gsap.set(cloudsRef.current.position, { z: 10 });

    gsap.set(canRef.current.position, {
      ...getXYPositions(-4),
    });

    const wordPositions =
      wordsRef.current &&
      Array.isArray(wordsRef.current.children) &&
      wordsRef.current.children.length > 0
        ? Array.from(wordsRef.current.children).map((word) => word.position)
        : [];

    if (wordPositions.length > 0) {
      gsap.set(wordPositions, { ...getXYPositions(7), z: 2 });
    }

    // Spinning can
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.7,
      repeat: -1,
      ease: "none",
    });

    const DISTANCE = 15;
    const DURATION = 6;

    gsap.set([cloud2Ref.current.position, cloud1Ref.current.position], {
      ...getXYPositions(DISTANCE),
    });

    gsap.to(cloud1Ref.current.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
    });

    gsap.to(cloud2Ref.current.position, {
      y: `+=${getYPosition(DISTANCE * 2)}`,
      x: `+=${getXPosition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      delay: DURATION / 2,
      duration: DURATION,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1.5,
      },
    });

    scrollTl
      .to("body", {
        backgroundColor: "#C0F0F5",
        overwrite: "auto",
        duration: 0.1,
      })
      .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        wordPositions,
        {
          keyframes: [
            { x: 0, y: 0, z: -1 },
            { ...getXYPositions(-7), z: -7 },
          ],
          stagger: 0.3,
        },
        0,
      )
      .to(canRef.current.position, {
        ...getXYPositions(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
  });

  return (
    <group ref={groupRef}>
      {/* Can */}
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8C0413" decay={0.6} />
        </FloatingCan>
      </group>

      {/* Clouds */}
      <Clouds ref={cloudsRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      <group ref={wordsRef}>
        {sentence && <ThreeText sentence={sentence} color="#F97315" />}
      </group>

      {/* Lights */}
      <ambientLight intensity={2} color="#9DDEFA" />
      <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  );
}
