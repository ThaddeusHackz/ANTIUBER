import Link from "next/link";

/**
 * The Uber logotype is a registered trademark. This clone ships a distinct
 * wordmark in the same optical style (tight geometric sans, low contrast)
 * rather than reproducing the official mark.
 */
export function Wordmark({
  className = "",
  href = "/",
  label = "Uber",
}: {
  className?: string;
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label} — home`}
      className={`inline-flex items-baseline text-[25px] font-semibold leading-none tracking-[-0.055em] text-black ${className}`}
    >
      <span>{label}</span>
      <span className="ml-[3px] mb-[2px] h-[5px] w-[5px] rounded-full bg-black" aria-hidden />
    </Link>
  );
}

export function Avatar({
  name,
  size = 36,
  href = "/account",
}: {
  name: string;
  size?: number;
  href?: string;
}) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <Link
      href={href}
      aria-label="Account"
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-full bg-black text-[12px] font-semibold text-white hover:opacity-85 transition-opacity"
    >
      {letters || "U"}
    </Link>
  );
}
