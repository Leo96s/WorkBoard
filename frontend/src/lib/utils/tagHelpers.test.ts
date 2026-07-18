import { describe, expect, it } from "vitest";
import { filterSuggestedTags, addTag, removeTag } from "./tagHelpers";

describe("filterSuggestedTags", () => {
  it("exclui tags já selecionadas", () => {
    const result = filterSuggestedTags(["bug", "feature", "urgent"], "", ["bug"]);
    expect(result).toEqual(["feature", "urgent"]);
  });

  it("filtra por texto do input, sem distinguir maiúsculas/minúsculas", () => {
    const result = filterSuggestedTags(["Bug", "Feature", "Urgent"], "urg", []);
    expect(result).toEqual(["Urgent"]);
  });

  it("devolve lista vazia quando nada corresponde", () => {
    const result = filterSuggestedTags(["bug", "feature"], "xyz", []);
    expect(result).toEqual([]);
  });
});

describe("addTag", () => {
  it("adiciona uma nova tag com espaços removidos", () => {
    expect(addTag(["bug"], "  urgent  ")).toEqual(["bug", "urgent"]);
  });

  it("não adiciona tag duplicada", () => {
    expect(addTag(["bug"], "bug")).toEqual(["bug"]);
  });

  it("não adiciona tag vazia ou só com espaços", () => {
    expect(addTag(["bug"], "   ")).toEqual(["bug"]);
  });
});

describe("removeTag", () => {
  it("remove a tag indicada", () => {
    expect(removeTag(["bug", "urgent"], "bug")).toEqual(["urgent"]);
  });

  it("não altera a lista se a tag não existir", () => {
    expect(removeTag(["bug"], "nope")).toEqual(["bug"]);
  });
});
