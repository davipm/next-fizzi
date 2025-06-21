"use client";

import { View } from "@react-three/drei";
import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/bounded";
import Scene from "@/slices/SkyDive/scene";

/**
 * Props for `SkyDive`.
 */
export type SkyDiveProps = SliceComponentProps<Content.SkyDiveSlice>;

/**
 * Renders the SkyDive slice component, displaying a full-screen bounded section
 * with an accessible heading and a 3D scene based on the provided slice content.
 *
 * @param slice - The SkyDive slice data from Prismic.
 * @returns A React component with a 3D scene and associated content.
 *
 * Component for "SkyDive" Slices.
 */
const SkyDive: FC<SkyDiveProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="skydive h-screen"
    >
      <h2 className="sr-only">{slice.primary.sentence}</h2>
      <View className="h-screen w-screen">
        <Scene
          sentence={slice.primary.sentence}
          flavor={slice.primary.flavor}
        />
      </View>
    </Bounded>
  );
};

export default SkyDive;
