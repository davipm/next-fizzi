"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Content } from "@prismicio/client";
import { useGSAP } from "@gsap/react";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";

import useMediaQuery from "@/hooks/use-media-query";
import FloatingCan from "@/components/floating-can";

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
    // TODO: Spinning can
  });

  return (
    <group ref={groupRef}>
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

      <ambientLight intensity={2} color="#9DDEFA" />
      <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  );
}
