import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  wordDisplayStyle?: "inline-block" | "block";
};

/**
 * Splits the provided text into words and characters,
 * rendering each character in a separate span for fine-grained styling or animation.
 *
 * @param text - The string to be split and rendered.
 * @param className - Optional additional class names for each word span.
 * @param wordDisplayStyle - CSS display style for each word ("inline-block" or "block"). Defaults to "inline-block".
 * @returns A React fragment containing the split text, or null if no text is provided.
 */
export default function TextSplitter({
  text,
  className,
  wordDisplayStyle = "inline-block",
}: Props) {
  if (!text) return null;

  const words = text.split(" ");

  return (
    <>
      {words.map((word, wordIndex) => {
        const splitText = word.split("");
        return (
          <span
            key={`${wordIndex}-${word}`}
            className={clsx("split-word", className)}
            style={{ display: wordDisplayStyle, whiteSpace: "pre" }}
          >
            {splitText.map((char, charIndex) => {
              if (char === " ") return ` `;
              return (
                <span
                  key={charIndex}
                  className={`split-char inline-block split-char--${wordIndex}-${charIndex}`}
                >
                  {char}
                </span>
              );
            })}

            {wordIndex < words.length - 1 ? (
              <span className="split-char">{` `}</span>
            ) : (
              ""
            )}
          </span>
        );
      })}
    </>
  );
}
