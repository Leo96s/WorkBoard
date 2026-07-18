import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useColumns } from "./useColumns";
import { columnApi } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  columnApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
  },
}));

const mockedColumnApi = vi.mocked(columnApi);

describe("useColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("cria uma coluna com sucesso", async () => {
    mockedColumnApi.create.mockResolvedValue({} as never);
    const { result } = renderHook(() => useColumns());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createColumn("board-1", "Nova Coluna");
    });

    expect(ok).toBe(true);
    expect(mockedColumnApi.create).toHaveBeenCalledWith("board-1", expect.objectContaining({ name: "Nova Coluna" }));
  });

  it("ao falhar a criação (ex: nome demasiado longo), devolve false e mostra a mensagem do backend em vez de rebentar (regressão)", async () => {
    mockedColumnApi.create.mockRejectedValue(
      Object.assign(new Error("Request failed with status code 400"), {
        isAxiosError: true,
        response: {
          status: 400,
          data: { errors: { Name: ["The field Name must be a string with a maximum length of 50."] } },
        },
      })
    );

    const { result } = renderHook(() => useColumns());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createColumn("board-1", "x".repeat(300));
    });

    expect(ok).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("maximum length of 50"));
  });

  it("não apaga a coluna se os IDs forem inválidos", async () => {
    const { result } = renderHook(() => useColumns());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.deleteColumn("", "col-1");
    });

    expect(ok).toBe(false);
    expect(mockedColumnApi.delete).not.toHaveBeenCalled();
  });

  it("apaga a coluna com sucesso", async () => {
    mockedColumnApi.delete.mockResolvedValue({} as never);
    const { result } = renderHook(() => useColumns());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.deleteColumn("board-1", "col-1");
    });

    expect(ok).toBe(true);
    expect(mockedColumnApi.delete).toHaveBeenCalledWith("board-1", "col-1");
  });
});
