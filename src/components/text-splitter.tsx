import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  wordDisplayStyle?: 'inline-block' | 'block';
}

export default function TextSplitter({ text, className, wordDisplayStyle = 'inline-block' }: Props) {
  if (!text) return null;

  const words = text.split(" ");

  return words.map((word, wordIndex) => {
    const splitText = word.split('')
    return (
      <span key={`${wordIndex}-${word}`} className={clsx('split-word', className)} style={{ display: wordDisplayStyle, whiteSpace: 'pre' }}>
        {splitText.map((char, charIndex) => {
          if (char === ' ') return ` `;
          return (
            <span key={charIndex} className={`split-word inline-block split-word--${wordIndex}-${charIndex}`}>
              {char}
            </span>
          )
        })}

        {wordIndex < words.length - 1 ? (
          <span className="split-char">{` `}</span>
        ): ''}
      </span>
    )
  })
}
