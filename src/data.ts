import type { IncidentEvent, Robot } from "./types";

export const robots: Robot[] = [
  { id: "SC-02", name: "Scout-02", role: "Scout", battery: 68, link: 46, status: "intermittent", eta: "04:12", fit: "Narrow access", lastSeen: "8 sec" },
  { id: "AT-03", name: "Atlas-03", role: "Heavy", battery: 74, link: 88, status: "ready", eta: "06:48", fit: "Debris lift", lastSeen: "3 sec" },
  { id: "RV-01", name: "Raven-01", role: "Medic", battery: 52, link: 41, status: "intermittent", eta: "07:31", fit: "Medical payload", lastSeen: "14 sec" },
  { id: "RL-06", name: "Relay-06", role: "Relay", battery: 81, link: 92, status: "active", eta: "05:06", fit: "Mesh extension", lastSeen: "2 sec" },
  { id: "SP-04", name: "Sparrow-04", role: "Scout", battery: 34, link: 0, status: "offline", eta: "--:--", fit: "Thermal scan", lastSeen: "2 min" },
];

export const initialEvents: IncidentEvent[] = [
  { id: "e1", time: "14:32:01", type: "signal", title: "Survivor signal updated", detail: "S-04 acoustic and thermal confidence rose to 82%." },
  { id: "e2", time: "14:31:40", type: "route", title: "Route R-17A discovered", detail: "Scout-02 confirmed a 1.2 m passable corridor." },
  { id: "e3", time: "14:30:41", type: "hazard", title: "Structural hazard detected", detail: "Collapse risk marked high near Block N-17." },
  { id: "e4", time: "14:29:55", type: "link", title: "Link intermittent", detail: "Scout-02 packet loss reached 32%." },
];
