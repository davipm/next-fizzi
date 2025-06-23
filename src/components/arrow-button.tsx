import ArrowIcon from "@/slices/Carousel/arrow-icon";
import clsx from "clsx";

type Props = {
  direction?: "right" | "left";
  label: string;
  onClick: () => void;
};

export default function ArrowButton({
  direction = "right",
  label,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white hover:cursor-pointer focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
