import type { HTMLAttributes } from "react";

export function splitHeading(value: string) {
  const heading = value.trim();
  const splitAt = heading.lastIndexOf(" ");
  if (splitAt < 0) return { head: heading, tail: "" };
  return {
    head: heading.slice(0, splitAt),
    tail: heading.slice(splitAt + 1),
  };
}

export function Marker({ n }: { n: string }) {
  return (
    <span className="inline-flex size-8 items-center justify-center rounded-full border border-current text-xs">
      {n}
    </span>
  );
}

export function Dot(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={`size-2 rounded-full bg-brand ${props.className ?? ""}`}
    />
  );
}
