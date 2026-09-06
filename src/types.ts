export type RobotStatus = "ready" | "active" | "intermittent" | "offline";

export type Robot = {
  id: string;
  name: string;
  role: "Scout" | "Heavy" | "Medic" | "Relay";
  battery: number;
  link: number;
  status: RobotStatus;
  eta: string;
  fit: string;
  lastSeen: string;
};

export type IncidentEvent = {
  id: string;
  time: string;
  type: "signal" | "route" | "hazard" | "command" | "link";
  title: string;
  detail: string;
};
