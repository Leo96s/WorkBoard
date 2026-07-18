import { describe, expect, it } from "vitest";
import { tagColor } from "./tagColor";

describe("tagColor", () => {
  it("devolve sempre a mesma cor para a mesma tag", () => {
    expect(tagColor("urgent")).toBe(tagColor("urgent"));
  });

  it("devolve uma classe Tailwind não vazia", () => {
    expect(tagColor("bug")).toMatch(/^bg-\S+ text-\S+$/);
  });

  it("pode gerar cores diferentes para tags diferentes", () => {
    const colors = new Set(["bug", "feature", "urgent", "docs", "chore"].map(tagColor));
    expect(colors.size).toBeGreaterThan(1);
  });
});
