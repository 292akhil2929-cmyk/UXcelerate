import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Broadcast,
  CaretDown,
  Funnel,
  Path,
  Play,
  Robot,
  WarningDiamond,
} from "@phosphor-icons/react";
import type { IncidentEvent } from "../types";

type EventRecorderProps = {
  events: IncidentEvent[];
  expanded: boolean;
  onToggle: () => void;
};

const iconMap = {
  signal: Broadcast,
  route: Path,
  hazard: WarningDiamond,
  command: Robot,
  link: Broadcast,
};

export function EventRecorder({ events, expanded, onToggle }: EventRecorderProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section className={`event-recorder ${expanded ? "expanded" : ""}`} aria-labelledby="event-title">
      <div className="recorder-head">
        <div><h2 id="event-title">Black box timeline</h2><span>All times UTC</span></div>
        <button type="button" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? "Collapse log" : "Open event log"} <CaretDown />
        </button>
      </div>

      <div className="timeline-axis" aria-label="Incident timeline from 13:52 to 14:40">
        {['13:52', '14:00', '14:08', '14:16', '14:24', '14:32', '14:40'].map((time) => <span key={time}>{time}</span>)}
        <motion.i
          className="playhead"
          initial={reduceMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        >14:32:08</motion.i>
      </div>

      <div className="tracks">
        <div><span><Broadcast />Signals</span><i className="track orange"><b style={{ left: '19%' }} /><b style={{ left: '52%' }} /><b style={{ left: '79%' }} /></i></div>
        <div><span><Robot />Robots</span><i className="track blue"><b style={{ left: '25%' }} /><b style={{ left: '61%' }} /><b style={{ left: '86%' }} /></i></div>
        <div><span><WarningDiamond />Hazards</span><i className="track red"><b style={{ left: '31%' }} /><b style={{ left: '58%' }} /><b style={{ left: '92%' }} /></i></div>
      </div>

      <div className="recorder-controls" aria-label="Timeline controls">
        <button type="button"><Play weight="fill" /> Replay from 14:24</button>
        <button type="button"><Funnel /> Event filters</button>
        <span>Coverage 64%</span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="event-log"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="log-tools">
              <button type="button"><Play weight="fill" /> Replay</button>
              <button type="button"><Funnel /> Filter</button>
            </div>
            <ul>
              {events.map((event) => {
                const Icon = iconMap[event.type];
                return <li key={event.id} className={event.type}><Icon /><time>{event.time}</time><div><strong>{event.title}</strong><span>{event.detail}</span></div></li>;
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
