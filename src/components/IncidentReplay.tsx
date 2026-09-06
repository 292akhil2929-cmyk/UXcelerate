import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, Crosshair, Pulse } from "@phosphor-icons/react";

const FRAME_COUNT = 49;

const frameSource = (index: number) =>
  `/incident-replay/frame-${String(index + 1).padStart(3, "0")}.webp`;

type ReplayBeatProps = {
  eyebrow: string;
  title: string;
  copy: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  action?: boolean;
};

function ReplayBeat({ eyebrow, title, copy, progress, range, action }: ReplayBeatProps) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [28, 0, 0, -24]);

  return (
    <motion.div className="replay-beat" style={{ opacity, y }}>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      {action && (
        <a className="replay-enter" href="#command">
          Enter command layer <ArrowDown weight="bold" />
        </a>
      )}
    </motion.div>
  );
}

export function IncidentReplay() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 145,
    damping: 28,
    mass: 0.22,
  });
  const imageScale = useTransform(progress, [0, 1], [1.07, 1]);
  const imageY = useTransform(progress, [0, 1], ["0%", "-2.5%"]);
  const vignetteOpacity = useTransform(progress, [0, 0.48, 1], [0.76, 0.38, 0.64]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const sync = () => setIsCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || isCompact) return;

    let cancelled = false;
    const preload = () => {
      for (let index = 1; index < FRAME_COUNT; index += 1) {
        if (cancelled) break;
        const image = new Image();
        image.decoding = "async";
        image.src = frameSource(index);
      }
    };

    const preloadId = globalThis.setTimeout(preload, 350);

    return () => {
      cancelled = true;
      globalThis.clearTimeout(preloadId);
    };
  }, [isCompact, reduceMotion]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion || isCompact || !imageRef.current) return;
    const index = Math.min(FRAME_COUNT - 1, Math.round(latest * (FRAME_COUNT - 1)));
    const next = frameSource(index);
    if (!imageRef.current.src.endsWith(next)) imageRef.current.src = next;
  });

  return (
    <section
      className={`incident-replay ${reduceMotion || isCompact ? "is-static" : ""}`}
      ref={sectionRef}
      aria-label="Incident reconstruction"
    >
      <div className="replay-stage">
        <motion.img
          ref={imageRef}
          className="replay-frame"
          src="/incident-replay/poster.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          style={reduceMotion || isCompact ? undefined : { scale: imageScale, y: imageY }}
        />
        <motion.div className="replay-vignette" style={{ opacity: vignetteOpacity }} />
        <div className="replay-grain" />

        <header className="replay-masthead">
          <a href="#command" className="replay-brand" aria-label="Riftline command interface">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            RIFTLINE
          </a>
          <div><Pulse weight="fill" /> Incident 04 / North Sector</div>
        </header>

        <div className="replay-readout" aria-hidden="true">
          <span>FIELD RECORD</span>
          <strong>07.0 SEC</strong>
          <i><motion.b style={{ scaleY: progress }} /></i>
          <small>00:00</small>
          <small>07:00</small>
        </div>

        <div className="replay-copy">
          <ReplayBeat
            progress={progress}
            range={[-0.01, 0, 0.17, 0.25]}
            eyebrow="01 / TERRAIN"
            title="The map ends here."
            copy="An earthquake has redrawn North Sector faster than the command map can update."
          />
          <ReplayBeat
            progress={progress}
            range={[0.2, 0.3, 0.43, 0.52]}
            eyebrow="02 / SIGNAL"
            title="Then, a pulse."
            copy="Faint. Intermittent. Enough to move—but never enough to pretend certainty."
          />
          <ReplayBeat
            progress={progress}
            range={[0.47, 0.58, 0.7, 0.79]}
            eyebrow="03 / RISK"
            title="The shortest route fails."
            copy="Aftershock fractures block the corridor. RIFTLINE recomputes around the danger."
          />
          <ReplayBeat
            progress={progress}
            range={[0.73, 0.83, 0.98, 1]}
            eyebrow="04 / DECISION"
            title="Command with uncertainty."
            copy="One survivor. One viable machine. Every decision recorded, reversible, and accountable."
            action
          />
        </div>

        {(reduceMotion || isCompact) && (
          <a className="replay-static-enter" href="#command">
            Open command interface <ArrowDown weight="bold" />
          </a>
        )}

        <div className="replay-lock" aria-hidden="true"><Crosshair /> COORDINATE LOCK / 40.713 N</div>
      </div>
    </section>
  );
}
