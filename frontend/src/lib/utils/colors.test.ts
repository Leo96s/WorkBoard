import { describe, expect, it } from "vitest";
import { getRandomColor } from "./colors";

const KNOWN_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

describe("getRandomColor", () => {
  it("devolve sempre uma cor da paleta conhecida", () => {
    for (let i = 0; i < 30; i++) {
      expect(KNOWN_COLORS).toContain(getRandomColor());
    }
  });
});
