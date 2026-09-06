import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle, Robot, WarningDiamond, WifiSlash } from "@phosphor-icons/react";
import { initialEvents } from "./data";
import { DecisionRail } from "./components/DecisionRail";
import { EventRecorder } from "./components/EventRecorder";
import { FleetSheet } from "./components/FleetSheet";
import { IncidentReplay } from "./components/IncidentReplay";
import { TacticalMap } from "./components/TacticalMap";
import { TopBar } from "./components/TopBar";

function App() {
  const reduceMotion = useReducedMotion();
  const [selectedRobot, setSelectedRobot] = useState("SC-02");
  const [aftershock, setAftershock] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [fleetOpen, setFleetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const events = useMemo(() => {
    const additions = [];
    if (dispatched) additions.push({ id: "dispatch", time: "14:32:08", type: "command" as const, title: "Command queued", detail: "Scout-02 will receive CMD-7F2A when its link stabilizes." });
    if (aftershock) additions.push({ id: "shock", time: "14:32:06", type: "hazard" as const, title: "Aftershock modeled", detail: "Route R-17A now bypasses a new debris field." });
    return [...additions, ...initialEvents];
  }, [aftershock, dispatched]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "a") {
        setAftershock((current) => !current);
        setToast("Aftershock simulation state changed");
      }
      if (event.key.toLowerCase() === "f") setFleetOpen(true);
      if (event.key.toLowerCase() === "l") setActivityOpen((current) => !current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleAftershock = () => {
    setAftershock((current) => !current);
    setDispatched(false);
    setToast(aftershock ? "Simulation reset to baseline" : "Aftershock modeled. Route recalculated.");
  };

  const dispatch = () => {
    setDispatched(true);
    setActivityOpen(true);
    setToast("Command queued for Scout-02");
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#map-title">Skip to tactical map</a>
      <IncidentReplay />
      <div className="command-console" id="command">
        <TopBar
          lowBandwidth={lowBandwidth}
          onToggleBandwidth={() => { setLowBandwidth((current) => !current); setToast(lowBandwidth ? "Full map detail restored" : "Low-bandwidth map enabled"); }}
          onOpenActivity={() => setActivityOpen((current) => !current)}
        />

        <main className="command-layout">
          <div className="map-stack">
            {lowBandwidth && <div className="bandwidth-banner"><WifiSlash weight="fill" /><span><strong>Low-bandwidth mode</strong> Map texture paused. Commands remain available.</span></div>}
            <TacticalMap
              aftershock={aftershock}
              lowBandwidth={lowBandwidth}
              selectedRobot={selectedRobot}
              onSelectRobot={setSelectedRobot}
            />
            <EventRecorder events={events} expanded={activityOpen} onToggle={() => setActivityOpen((current) => !current)} />
          </div>

          <DecisionRail
            aftershock={aftershock}
            dispatched={dispatched}
            selectedRobot={selectedRobot}
            onSelectRobot={setSelectedRobot}
            onAftershock={toggleAftershock}
            onDispatch={dispatch}
          />
        </main>
      </div>

      <nav className="mobile-dock" aria-label="Mobile command navigation">
        <a href="#command"><WarningDiamond /><span>Incident</span></a>
        <button type="button" onClick={() => setFleetOpen(true)}><Robot /><span>Fleet</span></button>
        <button type="button" onClick={() => setActivityOpen((current) => !current)}><CheckCircle /><span>Activity</span></button>
      </nav>

      <FleetSheet open={fleetOpen} selectedRobot={selectedRobot} onSelectRobot={setSelectedRobot} onClose={() => setFleetOpen(false)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <CheckCircle weight="fill" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
