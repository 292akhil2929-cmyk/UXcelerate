import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BatteryCharging,
  Broadcast,
  Check,
  ClockCountdown,
  Path,
  Queue,
  RadioButton,
  Robot,
  ShieldWarning,
  WarningDiamond,
} from "@phosphor-icons/react";
import { robots } from "../data";

type DecisionRailProps = {
  aftershock: boolean;
  dispatched: boolean;
  selectedRobot: string;
  onSelectRobot: (id: string) => void;
  onAftershock: () => void;
  onDispatch: () => void;
};

export function DecisionRail({
  aftershock,
  dispatched,
  selectedRobot,
  onSelectRobot,
  onAftershock,
  onDispatch,
}: DecisionRailProps) {
  const reduceMotion = useReducedMotion();
  const candidates = robots.slice(0, 3);

  return (
    <aside className="decision-rail" aria-label="Current rescue decision">
      <section className="survivor-card">
        <div className="section-heading">
          <div><span>High priority signal</span><h2>Survivor S-04</h2></div>
          <div className="signal-symbol" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <dl className="survivor-metrics">
          <div><dt>Confidence</dt><dd>82%</dd></div>
          <div><dt>Data age</dt><dd>18 sec</dd></div>
          <div><dt>Sources</dt><dd>Acoustic + thermal</dd></div>
        </dl>
        <p><RadioButton weight="fill" /> Last detected in a stable void beside Block N-17.</p>
      </section>

      <section className="candidate-section" id="fleet">
        <div className="section-label"><span>Robot candidates</span><small>Ranked by route fit</small></div>
        <div className="candidate-list">
          {candidates.map((robot, index) => (
            <button
              type="button"
              key={robot.id}
              className={`candidate ${selectedRobot === robot.id ? "selected" : ""}`}
              onClick={() => onSelectRobot(robot.id)}
              aria-pressed={selectedRobot === robot.id}
            >
              <span className="rank">{index + 1}</span>
              <span className="candidate-icon"><Robot weight="fill" /></span>
              <span className="candidate-name"><strong>{robot.name}</strong><small>{robot.role}</small></span>
              <span className="candidate-data"><small>ETA</small><strong>{aftershock && index === 0 ? "05:03" : robot.eta}</strong></span>
              <span className="candidate-data"><small>Battery</small><strong>{robot.battery}%</strong></span>
              <span className={`candidate-link ${robot.status}`}><Broadcast /><small>{robot.status}</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="command-plan">
        <div className="section-label"><span>Recommended plan</span><small>Scout-02 to S-04</small></div>
        <ol>
          <li><span>1</span><p>Enter through north access gap</p><strong>42 m</strong></li>
          <li><span>2</span><p>{aftershock ? "Bypass new debris field" : "Traverse low debris corridor"}</p><strong>{aftershock ? "84 m" : "68 m"}</strong></li>
          <li><span>3</span><p>Keep 3 m collapse stand-off</p><strong>55 m</strong></li>
        </ol>
        <div className="risk-row">
          <span><ShieldWarning /> Route risk</span>
          <strong className={aftershock ? "risk-elevated" : "risk-low"}>{aftershock ? "Elevated" : "Low"}</strong>
          <span><ClockCountdown /> ETA {aftershock ? "05:03" : "04:12"}</span>
        </div>
      </section>

      <div className="command-actions">
        <button type="button" className="secondary-action" onClick={onAftershock}>
          <WarningDiamond weight="bold" /> {aftershock ? "Reset simulation" : "Run aftershock drill"}
        </button>
        <button type="button" className="primary-action" onClick={onDispatch} disabled={dispatched}>
          {dispatched ? <Check weight="bold" /> : <ArrowRight weight="bold" />}
          {dispatched ? "Command queued" : "Queue dispatch"}
        </button>
      </div>

      <section className="receipt" aria-live="polite">
        <div className="section-label"><span>Command receipt</span><small>CMD-7F2A</small></div>
        <div className="receipt-steps">
          {["Queued", "Delivered", "Acknowledged"].map((step, index) => {
            const active = dispatched && index === 0;
            return (
              <div className={active ? "active" : ""} key={step}>
                <span className="receipt-node">{active ? <Queue weight="fill" /> : <i />}</span>
                <strong>{step}</strong>
                <small>{active ? "14:32:08" : "Pending"}</small>
              </div>
            );
          })}
        </div>
        <AnimatePresence>
          {dispatched && (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <BatteryCharging weight="fill" /> Scout-02 will receive the command when its mesh link stabilizes.
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </aside>
  );
}
