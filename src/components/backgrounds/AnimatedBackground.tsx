// Reusable animated background system: layered drifting gradient blobs,
// floating particles, and an optional dot-grid texture. Pure CSS animation
// (no client JS, no canvas) so it stays cheap on low-end mobile devices and
// is fully disabled under prefers-reduced-motion (see globals.css).
//
// `variant` controls density/scale (how much is going on), `accent` picks
// the secondary color pairing so different pages don't all look identical.
//
// IMPORTANT: every class name below is a complete, static string. Tailwind's
// JIT scanner only picks up classes it can see literally in source — building
// them via `${variable}/20` template interpolation silently produces classes
// that never get generated (this bit us once already: the accent blobs were
// invisible in every non-"hero" variant because of exactly this).

type Variant = "hero" | "section" | "corner" | "minimal";
type Accent = "violet" | "blue" | "emerald" | "amber" | "rose";

interface AnimatedBackgroundProps {
  variant?: Variant;
  accent?: Accent;
  /** Which corner the "corner" variant anchors to. */
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

// Full, static class strings per accent/opacity combo actually used below.
const ACCENT_25: Record<Accent, string> = {
  violet: "bg-violet-500/25",
  blue: "bg-blue-500/25",
  emerald: "bg-emerald-500/25",
  amber: "bg-amber-500/25",
  rose: "bg-rose-500/25",
};

const ACCENT_20: Record<Accent, string> = {
  violet: "bg-violet-500/20",
  blue: "bg-blue-500/20",
  emerald: "bg-emerald-500/20",
  amber: "bg-amber-500/20",
  rose: "bg-rose-500/20",
};

function Particles({ count, seed = 0 }: { count: number; seed?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const n = i + seed;
    return {
      left: `${(n * 37 + seed * 11) % 100}%`,
      top: `${(n * 53 + seed * 7) % 100}%`,
      size: 2 + ((n * 3) % 3),
      delay: `${(n * 0.6) % 9}s`,
      duration: `${7 + (n % 5)}s`,
      opacity: 0.4 + ((n % 4) * 0.12),
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-float-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            // @ts-ignore custom property consumed by the float-particle keyframe
            "--particle-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function AnimatedBackground({
  variant = "section",
  accent = "violet",
  corner = "top-right",
  className = "",
}: AnimatedBackgroundProps) {
  if (variant === "hero") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)] animate-grid-pan opacity-60" />
        <div className="absolute top-[10%] left-[8%] w-[560px] h-[560px] bg-primary/25 rounded-full blur-[130px] animate-blob-drift-1" />
        <div className={`absolute top-[5%] right-[5%] w-[460px] h-[460px] ${ACCENT_25[accent]} rounded-full blur-[120px] animate-blob-drift-2`} />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[130px] animate-blob-drift-3" />
        <div className="absolute bottom-[0%] right-[20%] w-[380px] h-[380px] bg-emerald-500/15 rounded-full blur-[110px] animate-blob-drift-2" style={{ animationDelay: "-6s" }} />
        <Particles count={16} />
      </div>
    );
  }

  if (variant === "corner") {
    const positions: Record<string, string> = {
      "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
      "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
      "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
      "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
    };
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
        <div className={`absolute ${positions[corner]} w-[480px] h-[480px] bg-primary/20 rounded-full blur-[120px] animate-blob-drift-1`} />
        <div className={`absolute ${positions[corner]} w-[340px] h-[340px] ${ACCENT_20[accent]} rounded-full blur-[100px] animate-blob-drift-2`} />
        <Particles count={6} seed={5} />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,black,transparent)] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[320px] bg-primary/15 rounded-full blur-[120px] animate-blob-drift-1" />
      </div>
    );
  }

  // "section" — the default, balanced variant
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute top-1/4 left-1/4 w-[440px] h-[440px] bg-primary/20 rounded-full blur-[120px] animate-blob-drift-1" />
      <div className={`absolute bottom-1/4 right-1/4 w-[420px] h-[420px] ${ACCENT_20[accent]} rounded-full blur-[110px] animate-blob-drift-2`} />
      <Particles count={8} seed={3} />
    </div>
  );
}
