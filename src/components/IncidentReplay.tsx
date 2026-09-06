import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, Pulse } from "@phosphor-icons/react";

const FRAME_COUNT = 84;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;

const frameSource = (index: number) =>
  `/incident-replay/frame-${String(index + 1).padStart(3, "0")}.webp`;

type ReplayBeatProps = {
  title: string;
  copy: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  action?: boolean;
};

function ReplayBeat({ title, copy, progress, range, action }: ReplayBeatProps) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [18, 0, 0, -14]);

  return (
    <motion.div className="replay-beat" style={{ opacity, y }}>
      <h1>{title}</h1>
      <p>{copy}</p>
      {action && (
        <a className="replay-enter" href="#command">
          Open command interface <ArrowDown weight="bold" />
        </a>
      )}
    </motion.div>
  );
}

export function IncidentReplay() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const drawnFrameRef = useRef(-1);
  const desiredFrameRef = useRef(0);
  const [isCompact, setIsCompact] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 520,
    damping: 42,
    mass: 0.8,
    restDelta: 0.0002,
  });
  const imageScale = useTransform(progress, [0, 1], [1.035, 1]);
  const imageY = useTransform(progress, [0, 1], ["0%", "-1.2%"]);

  const drawFrame = useCallback((requestedIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frames = framesRef.current;
    let index = requestedIndex;
    let frame = frames[index];

    if (!frame?.complete || !frame.naturalWidth) {
      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = frames[index - distance];
        const after = frames[index + distance];
        if (before?.complete && before.naturalWidth) {
          index -= distance;
          frame = before;
          break;
        }
        if (after?.complete && after.naturalWidth) {
          index += distance;
          frame = after;
          break;
        }
      }
    }

    if (!frame?.naturalWidth || drawnFrameRef.current === index) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    context.drawImage(frame, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
    drawnFrameRef.current = index;
  }, []);

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
    let preloadId = 0;
    const frames = Array.from({ length: FRAME_COUNT }, () => new Image());
    framesRef.current = frames;

    const loadFrame = (index: number) => {
      if (cancelled || index >= FRAME_COUNT) return;
      const image = frames[index];
      image.decoding = "async";
      image.onload = () => {
        drawFrame(desiredFrameRef.current);
        preloadId = globalThis.setTimeout(() => loadFrame(index + 1), 18);
      };
      image.src = frameSource(index);
    };
    loadFrame(0);

    return () => {
      cancelled = true;
      globalThis.clearTimeout(preloadId);
      frames.forEach((image) => { image.onload = null; });
      framesRef.current = [];
      drawnFrameRef.current = -1;
    };
  }, [drawFrame, isCompact, reduceMotion]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion || isCompact) return;
    const index = Math.min(FRAME_COUNT - 1, Math.round(latest * (FRAME_COUNT - 1)));
    desiredFrameRef.current = index;
    drawFrame(index);
  });

  return (
    <section
      className={`incident-replay ${reduceMotion || isCompact ? "is-static" : ""}`}
      ref={sectionRef}
      aria-label="Illustrative incident reconstruction"
    >
      <div className="replay-stage">
        <img className="replay-poster" src="/incident-replay/poster.webp" alt="" aria-hidden="true" />
        <motion.canvas
          ref={canvasRef}
          className="replay-frame"
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          aria-hidden="true"
          style={reduceMotion || isCompact ? undefined : { scale: imageScale, y: imageY }}
        />
        <div className="replay-vignette" />

        <header className="replay-masthead">
          <a href="#command" className="replay-brand" aria-label="Riftline command interface">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            RIFTLINE
          </a>
          <div><Pulse weight="fill" /> Simulation / North Sector</div>
        </header>

        <div className="replay-readout" aria-hidden="true">
          <span>RECONSTRUCTION</span>
          <strong>05.25 SEC</strong>
          <i><motion.b style={{ scaleY: progress }} /></i>
          <small>00:00</small>
          <small>00:05</small>
        </div>

        <div className="replay-copy">
          <ReplayBeat
            progress={progress}
            range={[-0.01, 0, 0.2, 0.29]}
            title="The first map is already wrong."
            copy="North Sector changed in seconds. Streets, access points, and safe assumptions disappeared together."
          />
          <ReplayBeat
            progress={progress}
            range={[0.23, 0.33, 0.52, 0.61]}
            title="Survivor signal S-04."
            copy="It appears beneath Block N-17. Acoustic and thermal detections agree; the location remains uncertain."
          />
          <ReplayBeat
            progress={progress}
            range={[0.56, 0.68, 1, 1.01]}
            title="RIFTLINE keeps uncertainty visible."
            copy="Review the evidence, compare robot fit, and queue an accountable command when the link fails."
            action
          />
        </div>

        {(reduceMotion || isCompact) && (
          <a className="replay-static-enter" href="#command">
            Open command interface <ArrowDown weight="bold" />
          </a>
        )}

        <div className="replay-disclosure">Illustrative reconstruction — not field footage</div>
      </div>
    </section>
  );
}
