import { describe, expect, it } from "vitest";
import { robots } from "./data";
import { canSendImmediately, commandDeliveryLabel, rankRobotsByResponse } from "./domain";

describe("resilient command delivery", () => {
  it("queues commands when a robot link is intermittent", () => {
    expect(canSendImmediately(robots[0])).toBe(false);
    expect(commandDeliveryLabel(robots[0])).toBe("Queued for stable link");
  });

  it("holds commands for an offline robot", () => {
    expect(commandDeliveryLabel(robots[4])).toBe("Held until contact");
  });

  it("does not mutate the source fleet while ranking", () => {
    const sourceOrder = robots.map((robot) => robot.id);
    rankRobotsByResponse(robots);
    expect(robots.map((robot) => robot.id)).toEqual(sourceOrder);
  });
});
