import gsap from "gsap";
import { RefObject } from "react";
import { Group, Object3DEventMap } from "three";

type HeroAnimationProps = {
  hero: string;
  header: string;
  subheading: string;
  body: string;
  button: string;
};

export const heroAnimation = ({
  hero,
  button,
  header,
  subheading,
  body,
}: HeroAnimationProps) => {
  const introTl = gsap.timeline();

  introTl
    .set(hero, { opacity: 1 })
    .from(header, {
      scale: 3,
      opacity: 0,
      ease: "power4.in",
      delay: 0.3,
      stagger: 1,
    })
    .from(
      subheading,
      {
        opacity: 0,
        y: 30,
      },
      "+=.8",
    )
    .from(body, {
      opacity: 0,
      y: 10,
    })
    .from(button, {
      opacity: 0,
      y: 10,
      duration: 0.6,
    });

  return introTl;
};

type ScrollProps = {
  trigger: string;
  from: string;
  to: string;
};

export const scrollAnimation = ({ trigger, to, from }: ScrollProps) => {
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    },
  });

  scrollTl
    .fromTo(
      "body",
      {
        backgroundColor: "#FDE047",
      },
      {
        backgroundColor: "#D9F99D",
        overwrite: "auto",
      },
      1,
    )
    .from(from, {
      scale: 1.3,
      y: 40,
      rotate: -25,
      opacity: 0,
      stagger: 0.1,
      ease: "back.out(3)",
      duration: 0.5,
    })
    .from(to, {
      y: 20,
      opacity: 0,
    });

  return scrollTl;
};

type GroupRef = RefObject<Group<Object3DEventMap> | null>;

type SceneProps = {
  can1Ref: GroupRef;
  can2Ref: GroupRef;
  can3Ref: GroupRef;
  can4Ref: GroupRef;
  can5Ref: GroupRef;
  can1GroupRef: GroupRef;
  can2GroupRef: GroupRef;
  groupRef: GroupRef;
};

export const sceneAnimation = ({
  can1Ref,
  can2Ref,
  can3Ref,
  can4Ref,
  can5Ref,
  can1GroupRef,
  can2GroupRef,
  groupRef,
}: SceneProps) => {
  const refs = [
    can1Ref,
    can2Ref,
    can3Ref,
    can4Ref,
    can5Ref,
    can1GroupRef,
    can2GroupRef,
    groupRef,
  ];

  // Early exit if any ref is missing
  if (refs.some((ref) => !ref.current)) return;

  // Initial can positions and rotations
  gsap.set(can1Ref.current!.position, { x: -1.5 });
  gsap.set(can1Ref.current!.rotation, { z: -0.5 });

  gsap.set(can2Ref.current!.position, { x: 1.5 });
  gsap.set(can2Ref.current!.rotation, { z: 0.5 });

  gsap.set(can3Ref.current!.position, { y: 5, z: 2 });
  gsap.set(can4Ref.current!.position, { x: 2, y: 4, z: 2 });
  gsap.set(can5Ref.current!.position, { y: -5 });

  // Intro animation (on page load)
  if (window.scrollY < 20) {
    gsap
      .timeline({ defaults: { duration: 3, ease: "back.out(1.4)" } })
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
    }) // Rotate entire group
    .to(groupRef.current!.rotation, { y: Math.PI * 2 })

    // Can 1 - Black Cherry
    .to(can1Ref.current!.position, { x: -0.2, y: -0.7, z: -2 }, 0)
    .to(can1Ref.current!.rotation, { z: 0.3 }, 0)

    // Can 2 - Lemon Lime
    .to(can2Ref.current!.position, { x: 1, y: -0.2, z: -1 }, 0)
    .to(can2Ref.current!.rotation, { z: 0 }, 0)

    // Can 3 - Grape
    .to(can3Ref.current!.position, { x: -0.3, y: 0.5, z: -1 }, 0)
    .to(can3Ref.current!.rotation, { z: -0.1 }, 0)

    // Can 4 - Strawberry Lemonade
    .to(can4Ref.current!.position, { x: 0, y: -0.3, z: 0.5 }, 0)
    .to(can4Ref.current!.rotation, { z: 0.3 }, 0)

    // Can 5 - Watermelon
    .to(can5Ref.current!.position, { x: 0.3, y: 0.5, z: -0.5 }, 0)
    .to(can5Ref.current!.rotation, { z: -0.25 }, 0)

    // Final group position shift
    .to(
      groupRef.current!.position,
      {
        x: 1,
        duration: 3,
        ease: "sine.inOut",
      },
      1.3,
    );
};
