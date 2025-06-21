"use client";

import gsap from "gsap";
import { useRef } from "react";
import { Group } from "three";
import { useStore } from "@/hooks/use-store";
import { useGSAP } from "@gsap/react";
import FloatingCan from "@/components/floating-can";
import { Environment } from "@react-three/drei";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Renders a 3D scene with animated floating cans and an environment background.
 * Initializes can positions and triggers GSAP-based intro and scroll animations.
 * Uses organization-specific hooks and components for state and rendering.
 *
 * Scene component renders and animates a group of floating cans in a 3D environment.
 */
export default function Scene() {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);
  const can5Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can3Ref.current ||
      !can4Ref.current ||
      !can5Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Initial positions and rotations
    gsap.set(can1Ref.current!.position, { x: -1.5 });
    gsap.set(can1Ref.current!.rotation, { z: -0.5 });
    gsap.set(can2Ref.current!.position, { x: 1.5 });
    gsap.set(can2Ref.current!.rotation, { z: 0.5 });
    gsap.set(can3Ref.current!.position, { y: 5, z: 2 });
    gsap.set(can4Ref.current!.position, { x: 2, y: 4, z: 2 });
    gsap.set(can5Ref.current!.position, { y: -5 });

    // Intro animation
    if (window.scrollY < 20) {
      gsap
        .timeline({ defaults: { duration: 3, easing: "back.out(1.4)" } })
        .from(can1GroupRef.current!.position, { y: -5, x: 1 }, 0)
        .from(can1GroupRef.current!.rotation, { z: 3 }, 0)
        .from(can2GroupRef.current!.position, { y: 5, x: 1 }, 0)
        .from(can2GroupRef.current!.rotation, { z: 3 }, 0);
    }

    // Scroll-triggered animation
    gsap
      .timeline({
        defaults: { duration: 2 },
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      })
      .to(groupRef.current!.rotation, { y: Math.PI * 2 })
      .to(can1Ref.current!.position, { x: -0.2, y: -0.7, z: -2 }, 0)
      .to(can1Ref.current!.rotation, { z: 0.3 }, 0)
      .to(can2Ref.current!.position, { x: 1, y: -0.2, z: -1 }, 0)
      .to(can2Ref.current!.rotation, { z: 0 }, 0)
      .to(can3Ref.current!.position, { x: -0.3, y: 0.5, z: -1 }, 0)
      .to(can3Ref.current!.rotation, { z: -0.1 }, 0)
      .to(can4Ref.current!.position, { x: 0, y: -0.3, z: 0.5 }, 0)
      .to(can4Ref.current!.rotation, { z: 0.3 }, 0)
      .to(can5Ref.current!.position, { x: 0.3, y: 0.5, z: -0.5 }, 0)
      .to(can5Ref.current!.rotation, { z: -0.25 }, 0)
      .to(
        groupRef.current!.position,
        { x: 1, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="lemonLime"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <FloatingCan ref={can3Ref} flavor="grape" floatSpeed={FLOAT_SPEED} />
      <FloatingCan
        ref={can4Ref}
        flavor="strawberryLemonade"
        floatSpeed={FLOAT_SPEED}
      />
      <FloatingCan ref={can5Ref} flavor="watermelon" floatSpeed={FLOAT_SPEED} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
