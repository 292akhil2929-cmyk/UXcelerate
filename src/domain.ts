import type { Robot } from "./types";

export function canSendImmediately(robot: Robot) {
  return robot.status !== "offline" && robot.link >= 60;
}

export function commandDeliveryLabel(robot: Robot) {
  if (robot.status === "offline") return "Held until contact";
  if (!canSendImmediately(robot)) return "Queued for stable link";
  return "Ready to deliver";
}

export function rankRobotsByResponse(robots: Robot[]) {
  const statusPenalty = { active: 0, ready: 0, intermittent: 120, offline: 9999 };
  return [...robots].sort((a, b) => {
    const etaA = Number(a.eta.replace(":", "")) || 9999;
    const etaB = Number(b.eta.replace(":", "")) || 9999;
    return etaA + statusPenalty[a.status] - (etaB + statusPenalty[b.status]);
  });
}
