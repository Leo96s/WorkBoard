import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTags } from "./useTags";

describe("useTags", () => {
  it("começa sem tags globais", () => {
    const { result } = renderHook(() => useTags());
    expect(result.current.globalTags).toEqual([]);
  });

  it("adiciona novas tags únicas", () => {
    const { result } = renderHook(() => useTags());

    act(() => {
      result.current.mergeGlobalTags(["bug", "feature"]);
    });

    expect(result.current.globalTags).toEqual(["bug", "feature"]);
  });

  it("não duplica tags já existentes", () => {
    const { result } = renderHook(() => useTags());

    act(() => {
      result.current.mergeGlobalTags(["bug"]);
    });
    act(() => {
      result.current.mergeGlobalTags(["bug", "urgent"]);
    });

    expect(result.current.globalTags).toEqual(["bug", "urgent"]);
  });

  it("mantém a mesma referência de globalTags quando não há tags novas (evita re-renders/loops)", () => {
    const { result, rerender } = renderHook(() => useTags());

    act(() => {
      result.current.mergeGlobalTags(["bug"]);
    });
    const reference = result.current.globalTags;

    rerender();
    act(() => {
      result.current.mergeGlobalTags(["bug"]);
    });

    expect(result.current.globalTags).toBe(reference);
  });

  it("mantém a identidade de mergeGlobalTags estável entre renders", () => {
    const { result, rerender } = renderHook(() => useTags());
    const first = result.current.mergeGlobalTags;

    rerender();

    expect(result.current.mergeGlobalTags).toBe(first);
  });
});
