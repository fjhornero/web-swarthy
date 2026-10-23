import { Overline } from "@/components/Overline";

/** Cabecera centrada de sección: overline + h2 (+ párrafo opcional). */
export function SectionHeading({
  overline,
  title,
  children,
  size = "lg",
  className = "mb-14",
}: {
  overline: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <Overline>{overline}</Overline>
      <h2
        className={
          size === "lg"
            ? "font-display text-4xl uppercase md:text-6xl"
            : "font-display text-3xl uppercase md:text-5xl"
        }
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
