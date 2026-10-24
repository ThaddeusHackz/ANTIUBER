"use client";

import { useMemo } from "react";

/**
 * Stylised vector map of central Accra. Rendered as SVG so the rider view works
 * with no API key, no tiles and no third-party requests.
 */
export function AccraMap({
  className = "",
  progress = 0,
  showRoute = false,
  showCars = true,
  pickupLabel = "Independence Ave",
  dropoffLabel,
}: {
  className?: string;
  progress?: number;
  showRoute?: boolean;
  showCars?: boolean;
  pickupLabel?: string;
  dropoffLabel?: string;
}) {
  // Deterministic block + minor street generation.
  const { blocks, minors } = useMemo(() => {
    let seed = 20261024;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const blocks: { x: number; y: number; w: number; h: number; o: number }[] = [];
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 16; col++) {
        if (rnd() < 0.26) continue;
        const x = col * 44 + 8 + rnd() * 4;
        const y = row * 40 + 8 + rnd() * 4;
        const w = 24 + rnd() * 10;
        const h = 20 + rnd() * 9;
        blocks.push({ x, y, w, h, o: 0.25 + rnd() * 0.45 });
      }
    }

    const minors: string[] = [];
    for (let row = 1; row < 11; row++) {
      minors.push(`M0 ${row * 40} L704 ${row * 40}`);
    }
    for (let col = 1; col < 16; col++) {
      minors.push(`M${col * 44} 0 L${col * 44} 460`);
    }

    return { blocks, minors };
  }, []);

  // Route: pickup (south-west) to dropoff (north-east)
  const route =
    "M118 392 L156 392 L156 316 L232 316 L232 268 L318 268 L318 214 L404 214 L404 152 L492 152 L492 104 L566 104";
  const routeLen = 900;
  const dash = routeLen * Math.max(0, Math.min(1, progress));

  const carPos = [
    { x: 268, y: 300, r: -90 },
    { x: 470, y: 132, r: 0 },
    { x: 380, y: 382, r: -90 },
    { x: 92, y: 214, r: 0 },
  ];

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#EFEDE8] ${className}`}>
      <svg
        viewBox="0 0 704 460"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Map of Accra showing your pickup and destination"
      >
        <defs>
          <pattern id="grid" width="44" height="40" patternUnits="userSpaceOnUse">
            <rect width="44" height="40" fill="#EFEDE8" />
          </pattern>
        </defs>

        <rect width="704" height="460" fill="#EFEDE8" />

        {/* water: Gulf of Guinea bottom edge */}
        <path
          d="M0 436 C 90 424, 150 444, 240 432 C 330 420, 420 446, 520 434 C 600 424, 660 440, 704 430 L704 460 L0 460 Z"
          fill="#CADFE6"
        />
        <path
          d="M0 436 C 90 424, 150 444, 240 432 C 330 420, 420 446, 520 434 C 600 424, 660 440, 704 430"
          fill="none"
          stroke="#AFCFD9"
          strokeWidth="2"
        />

        {/* park */}
        <ellipse cx="592" cy="330" rx="66" ry="46" fill="#DDE6D5" />

        {/* minor street grid */}
        <g stroke="#DCD9D2" strokeWidth="1.4">
          {minors.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* city blocks */}
        <g fill="#E4E1DA">
          {blocks.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={1.5}
              opacity={b.o}
            />
          ))}
        </g>

        {/* major roads */}
        <g fill="none" strokeLinecap="round">
          <path d="M-10 392 L714 356" stroke="#FFFFFF" strokeWidth="13" />
          <path d="M-10 392 L714 356" stroke="#F7E9C8" strokeWidth="10" />
          <path d="M156 -10 L156 470" stroke="#FFFFFF" strokeWidth="11" />
          <path d="M156 -10 L156 470" stroke="#FFFFFF" strokeWidth="7" />
          <path d="M-10 214 L714 152" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M-10 214 L714 152" stroke="#F7E9C8" strokeWidth="9" />
          <path d="M232 -10 L318 470" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M492 -10 L404 470" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M-10 100 C 160 120, 340 60, 714 92" stroke="#FFFFFF" strokeWidth="9" />
        </g>

        {/* road labels */}
        <g
          fill="#8C877E"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="0.6"
          fontFamily="Inter, sans-serif"
        >
          <text x="262" y="188" transform="rotate(-4.7 262 188)">
            LIBERATION RD
          </text>
          <text x="168" y="70" transform="rotate(90 168 70)">
            INDEPENDENCE AVE
          </text>
          <text x="330" y="404" transform="rotate(-4.7 330 404)">
            RING ROAD W
          </text>
          <text x="508" y="238" transform="rotate(-86 508 238)">
            OXFORD ST
          </text>
          <text x="452" y="56">
            AIRPORT RESIDENTIAL
          </text>
          <text x="62" y="336">JAMESTOWN</text>
          <text x="250" y="452">OSU · LABADI</text>
        </g>

        {/* water label */}
        <text
          x="470"
          y="452"
          fill="#7BA3B1"
          fontSize="9"
          fontStyle="italic"
          fontFamily="Inter, sans-serif"
        >
          Gulf of Guinea
        </text>

        {/* route */}
        {showRoute && (
          <>
            <path
              d={route}
              fill="none"
              stroke="#000"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.1"
            />
            <path
              d={route}
              fill="none"
              stroke="#000"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${dash} ${routeLen}`}
              style={{ transition: "stroke-dasharray .9s linear" }}
            />
            <circle cx="566" cy="104" r="7" fill="#0E8345" stroke="#fff" strokeWidth="2.5" />
            <circle cx="118" cy="392" r="6" fill="#000" stroke="#fff" strokeWidth="2.5" />
          </>
        )}

        {/* idle pickup dot */}
        {!showRoute && (
          <g>
            <circle cx="352" cy="250" r="26" fill="#000" opacity="0.06" />
            <circle cx="352" cy="250" r="14" fill="#000" opacity="0.1" />
            <circle cx="352" cy="250" r="6" fill="#000" stroke="#fff" strokeWidth="2.5" />
          </g>
        )}

        {/* nearby cars */}
        {showCars &&
          carPos.map((c, i) => (
            <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
              <rect x="-9" y="-5" width="18" height="10" rx="3" fill="#111" />
              <rect x="-4" y="-3.2" width="8" height="6.4" rx="1.6" fill="#fff" opacity="0.85" />
            </g>
          ))}
      </svg>

      {pickupLabel && !showRoute && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-medium shadow-card">
            {pickupLabel}
          </span>
        </div>
      )}

      {dropoffLabel && showRoute && (
        <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-[12px] font-medium shadow-card backdrop-blur">
          {dropoffLabel}
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-lg bg-white shadow-card">
        <button
          aria-label="Zoom in"
          className="grid h-9 w-9 place-items-center border-b border-hair text-[16px] hover:bg-surface"
        >
          +
        </button>
        <button
          aria-label="Zoom out"
          className="grid h-9 w-9 place-items-center text-[16px] hover:bg-surface"
        >
          −
        </button>
      </div>
    </div>
  );
}
