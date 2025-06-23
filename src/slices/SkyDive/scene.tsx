"use client";

import gsap from "gsap";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Content } from "@prismicio/client";
import { useGSAP } from "@gsap/react";

import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import useMediaQuery from "@/hooks/use-media-query";
import FloatingCan from "@/components/floating-can";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Renders a sentence as individual 3D text words using the @react-three/drei Text component.
 * Each word is displayed in uppercase, with responsive scaling based on screen size.
 *
 * @param sentence - The sentence to render as 3D text.
 * @param color - Optional color for the text. Defaults to "white".
 */
function ThreeText({
  sentence,
  color = "white",
}: {
  sentence: string;
  color?: string;
}) {
  const words = sentence.toUpperCase().split(" ");
  const material = new THREE.MeshLambertMaterial();
  const isDesktop = useMediaQuery("(min-width: 950px)", true);

  return (
    <>
      {words.map((word, wordIndex) => (
        <Text
          key={`${wordIndex}-${word}`}
          scale={isDesktop ? 1 : 0.5}
          color={color}
          material={material}
          font="/fonts/Alpino-Variable.woff"
          fontWeight={900}
          anchorX="center"
          anchorY="middle"
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?'"
        >
          {word}
        </Text>
      ))}
    </>
  );
}

type Props = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  const ANGLE = 75 * (Math.PI / 180);

  const getXPosition = (distance: number) => {
    return distance * Math.cos(ANGLE);
  };

  const getYPosition = (distance: number) => {
    return distance * Math.sin(ANGLE);
  };

  const getXYPositions = (distance: number) => {
    return {
      x: getXPosition(distance),
      Y: getYPosition(-1 * distance),
    };
  };

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

    gsap.set(cloudsRef.current.position, { Z: 10 });

    gsap.set(canRef.current.position, {
      ...getXYPositions(-4),
    });

    gsap.set(
      wordsRef.current.children.map((word) => word.position),
      { ...getXYPositions(7), Z: 2 },
    );

    // Spinning can
    gsap.to(canRef.current.position, {
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
        overflow: "auto",
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
        wordsRef.current.children.map((word) => word.position),
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
        />
        <pointLight intensity={30} color="#8C0413" decay={0.6} />
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
