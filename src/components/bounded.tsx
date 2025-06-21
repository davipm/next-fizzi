import React from "react";
import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders a layout container that centers its children within a maximum width,
 * allowing customization of the root element and additional class names.
 *
 * @param as - The element type to render as the root (defaults to "section").
 * @param className - Additional class names to apply to the root element.
 * @param children - The content to be rendered inside the container.
 * @param rest - Additional props passed to the root element.
 */
export default function Bounded({
  as: Comp = "section",
  className,
  children,
  ...rest
}: BoundedProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <Comp className={clsx("px-4 pt-10 md:px-6", className)} {...rest}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {children}
      </div>
    </Comp>
  );
}
