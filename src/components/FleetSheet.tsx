import { motion, useReducedMotion } from "motion/react";
import { Broadcast, Robot, X } from "@phosphor-icons/react";
import { robots } from "../data";

type FleetSheetProps = {
  open: boolean;
  selectedRobot: string;
  onSelectRobot: (id: string) => void;
  onClose: () => void;
};

export function FleetSheet({ open, selectedRobot, onSelectRobot, onClose }: FleetSheetProps) {
  const reduceMotion = useReducedMotion();
  if (!open) return null;

  return (
    <div className="sheet-backdrop" onMouseDown={onClose}>
      <motion.aside
        className="fleet-sheet"
        aria-label="Robot fleet"
        initial={reduceMotion ? false : { x: "100%" }}
        animate={{ x: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-head"><div><span>Fleet state</span><h2>Five rescue units</h2></div><button type="button" onClick={onClose} aria-label="Close fleet panel"><X /></button></div>
        <div className="fleet-list">
          {robots.map((robot) => (
            <button key={robot.id} type="button" className={selectedRobot === robot.id ? "selected" : ""} onClick={() => { onSelectRobot(robot.id); onClose(); }}>
              <span className="fleet-icon"><Robot weight="fill" /></span>
              <span><strong>{robot.name}</strong><small>{robot.role} / {robot.fit}</small></span>
              <span className="fleet-stats"><strong>{robot.battery}%</strong><small><Broadcast /> {robot.link}% link</small></span>
              <i className={`status-word ${robot.status}`}>{robot.status}</i>
            </button>
          ))}
        </div>
      </motion.aside>
    </div>
  );
}
