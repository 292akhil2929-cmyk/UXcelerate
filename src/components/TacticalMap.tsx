import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Broadcast,
  Buildings,
  CheckSquare,
  Crosshair,
  MapPin,
  Minus,
  Plus,
  Robot,
  Stack,
  WarningDiamond,
  X,
} from "@phosphor-icons/react";

type TacticalMapProps = {
  aftershock: boolean;
  lowBandwidth: boolean;
  selectedRobot: string;
  onSelectRobot: (id: string) => void;
};

const layers = [
  ["Structures", Buildings],
  ["Debris", Stack],
  ["Hazards", WarningDiamond],
  ["Signals", Broadcast],
  ["Robots", Robot],
  ["Blocked paths", X],
] as const;

export function TacticalMap({ aftershock, lowBandwidth, selectedRobot, onSelectRobot }: TacticalMapProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={`map-panel ${lowBandwidth ? "is-lite" : ""}`} aria-labelledby="map-title">
      <img className="map-plate" src="/assets/plates/tactical-map.png" alt="Simulated top-down map of the earthquake-damaged North Sector" />
      <div className="map-vignette" aria-hidden="true" />

      <div className="map-heading">
        <span>Sector N-17</span>
        <h1 id="map-title">North Sector</h1>
        <p>Simulated incident data</p>
      </div>

      <fieldset className="layer-panel">
        <legend>Map layers</legend>
        {layers.map(([label, Icon]) => (
          <label key={label}>
            <input type="checkbox" defaultChecked />
            <span className="check-box"><CheckSquare weight="fill" /></span>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <div className="sector-overview" aria-label="Sector overview">
        <span>Sector overview</span>
        <div className="sector-shape" aria-hidden="true"><i>NORTH</i><b /><b /><b /></div>
      </div>

      <div className="map-tools" aria-label="Map controls">
        <button type="button" aria-label="Zoom in"><Plus /></button>
        <button type="button" aria-label="Zoom out"><Minus /></button>
        <button type="button" aria-label="Center map"><Crosshair /></button>
      </div>

      <svg className="map-overlay" viewBox="0 0 1000 620" role="img" aria-label="Recommended route from Scout-02 around a collapse hazard to survivor S-04">
        <defs>
          <pattern id="hazardHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="2" />
          </pattern>
          <filter id="softSignal"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>

        <path className="uncertain-zone" d="M650 20 L965 28 L990 225 L846 264 L713 198 Z" />
        <text className="svg-label uncertainty-label" x="814" y="90">UNVERIFIED MAP</text>

        <AnimatePresence initial={false}>
          <motion.path
            key={aftershock ? "expanded" : "stable"}
            className="hazard-zone"
            d={aftershock ? "M360 238 L548 142 L714 242 L632 410 L408 430 L302 336 Z" : "M402 245 L548 176 L672 252 L604 378 L430 395 L342 326 Z"}
            fill="url(#hazardHatch)"
            initial={reduceMotion ? false : { opacity: 0.2, scale: 0.9 }}
            animate={{ opacity: 0.78, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        <text className="svg-label danger-label" x="475" y="300">COLLAPSE RISK</text>

        <path className="blocked-route" d="M248 430 C345 392 413 390 501 430 S673 456 760 410" />
        <g className="blocked-mark" transform="translate(760 410)"><path d="M-10 -10 L10 10 M10 -10 L-10 10" /></g>

        <motion.path
          className="safe-route-shadow"
          d={aftershock ? "M250 503 C310 472 334 424 319 370 C302 308 338 228 425 199 C540 161 624 168 704 112 C762 72 798 80 835 94" : "M250 503 C359 458 385 404 374 344 C362 273 421 222 506 206 C634 181 708 134 835 94"}
        />
        <motion.path
          className="safe-route"
          d={aftershock ? "M250 503 C310 472 334 424 319 370 C302 308 338 228 425 199 C540 161 624 168 704 112 C762 72 798 80 835 94" : "M250 503 C359 458 385 404 374 344 C362 273 421 222 506 206 C634 181 708 134 835 94"}
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {[{ x: 319, y: 370, n: 1 }, { x: 425, y: 199, n: 2 }, { x: 704, y: 112, n: 3 }].map((point) => (
          <g key={point.n} className="route-node" transform={`translate(${point.x} ${point.y})`}>
            <circle r="13" /><text x="0" y="5">{point.n}</text>
          </g>
        ))}

        <g className="survivor-signal" transform="translate(835 94)">
          <circle r="58" className="signal-glow" filter="url(#softSignal)" />
          <circle r="44" /><circle r="28" /><circle r="10" />
          <text className="svg-label" x="58" y="-10">SURVIVOR S-04</text>
          <text className="svg-value" x="58" y="14">82% CONFIDENCE</text>
        </g>
      </svg>

      <button
        type="button"
        className={`robot-marker scout ${selectedRobot === "SC-02" ? "selected" : ""}`}
        onClick={() => onSelectRobot("SC-02")}
        aria-pressed={selectedRobot === "SC-02"}
      >
        <Robot weight="fill" /><span>SCOUT-02</span>
      </button>

      <button
        type="button"
        className={`robot-marker atlas ${selectedRobot === "AT-03" ? "selected" : ""}`}
        onClick={() => onSelectRobot("AT-03")}
        aria-pressed={selectedRobot === "AT-03"}
      >
        <Robot weight="fill" /><span>ATLAS-03</span>
      </button>

      <div className="map-scale" aria-hidden="true"><span /> 25 m</div>
      <div className="north-mark" aria-label="Map orientation north"><MapPin weight="fill" /><span>N</span></div>

      {aftershock && (
        <motion.div className="aftershock-callout" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <WarningDiamond weight="fill" />
          <div><strong>Aftershock modeled</strong><span>Route R-17A recalculated</span></div>
          <button type="button" aria-label="Dismiss update"><X /></button>
        </motion.div>
      )}
    </section>
  );
}
