import * as THREE from "three";
import useMediaQuery from "@/hooks/use-media-query";
import { Text } from "@react-three/drei";

type Props = {
  sentence: string;
  color?: string;
};

/**
 * Renders a sentence as individual 3D text words using the @react-three/drei Text component.
 * Each word is displayed in uppercase, with responsive scaling based on screen size.
 *
 * @param sentence - The sentence to render as 3D text.
 * @param color - Optional color for the text. Defaults to "white".
 */
export default function ThreeText({ sentence, color = "white" }: Props) {
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
