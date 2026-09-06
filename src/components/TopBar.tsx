import {
  Broadcast,
  Clock,
  List,
  MapTrifold,
  Robot,
  SlidersHorizontal,
  Warning,
} from "@phosphor-icons/react";

type TopBarProps = {
  lowBandwidth: boolean;
  onToggleBandwidth: () => void;
  onOpenActivity: () => void;
};

export function TopBar({ lowBandwidth, onToggleBandwidth, onOpenActivity }: TopBarProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#command" aria-label="RIFTLINE command overview">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>RIFTLINE</span>
      </a>

      <div className="incident-chip">
        <span>Simulation 07</span>
        <strong>North Sector</strong>
      </div>

      <div className="status-strip" aria-label="Incident status">
        <span><Clock weight="bold" /> 14:32:08 <small>UTC</small></span>
        <span><Warning weight="fill" /> Data age <strong>18 sec</strong></span>
        <span className="link-warning"><Broadcast weight="bold" /> Link intermittent</span>
      </div>

      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="#command" className="active"><MapTrifold /> <span>Map</span></a>
        <a href="#fleet"><Robot /> <span>Robots</span></a>
        <button type="button" onClick={onOpenActivity}><List /> <span>Log</span></button>
        <button type="button" onClick={onToggleBandwidth} aria-pressed={lowBandwidth}>
          <SlidersHorizontal /> <span>{lowBandwidth ? "Full data" : "Low data"}</span>
        </button>
      </nav>
    </header>
  );
}
