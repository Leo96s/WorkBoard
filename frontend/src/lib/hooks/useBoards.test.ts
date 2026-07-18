import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useBoards } from "./useBoards";
import { boardApi, columnApi } from "@/lib/api";
import type { Board } from "@/types";

vi.mock("@/lib/api", () => ({
  boardApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
  },
  columnApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorder: vi.fn(),
  },
}));

const mockedBoardApi = vi.mocked(boardApi);
const mockedColumnApi = vi.mocked(columnApi);

function makeBoard(overrides: Partial<Board> = {}): Board {
  return { id: "board-1", name: "Board 1", order: 1, columns: [], ...overrides };
}

describe("useBoards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("carrega os boards e define o primeiro como ativo", async () => {
    const boards = [makeBoard({ id: "a" }), makeBoard({ id: "b" })];
    mockedBoardApi.getAll.mockResolvedValue({ data: boards } as never);

    const { result } = renderHook(() => useBoards());

    await waitFor(() => expect(result.current.boards).toEqual(boards));
    expect(result.current.activeBoard).toEqual(boards[0]);
  });

  it("mostra alerta quando loadBoards falha, sem rebentar", async () => {
    mockedBoardApi.getAll.mockRejectedValue(new Error("falhou"));

    renderHook(() => useBoards());

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });

  it("cria um board e recarrega a lista", async () => {
    mockedBoardApi.getAll.mockResolvedValue({ data: [] } as never);
    mockedBoardApi.create.mockResolvedValue({ data: makeBoard() } as never);

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(mockedBoardApi.getAll).toHaveBeenCalledTimes(1));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createBoard("Novo Board");
    });

    expect(ok).toBe(true);
    expect(mockedBoardApi.create).toHaveBeenCalledWith({ name: "Novo Board" });
    expect(mockedBoardApi.getAll).toHaveBeenCalledTimes(2);
  });

  it("ao falhar a criação (ex: nome demasiado longo), devolve false e mostra a mensagem do backend em vez de rebentar (regressão)", async () => {
    mockedBoardApi.getAll.mockResolvedValue({ data: [] } as never);
    mockedBoardApi.create.mockRejectedValue(
      Object.assign(new Error("Request failed with status code 400"), {
        isAxiosError: true,
        response: {
          status: 400,
          data: { errors: { Name: ["The field Name must be a string with a maximum length of 100."] } },
        },
      })
    );

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(mockedBoardApi.getAll).toHaveBeenCalledTimes(1));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createBoard("x".repeat(300));
    });

    expect(ok).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("maximum length of 100")
    );
  });

  it("pede confirmação antes de apagar um board e não apaga se o utilizador cancelar", async () => {
    mockedBoardApi.getAll.mockResolvedValue({ data: [makeBoard()] } as never);
    vi.spyOn(window, "confirm").mockImplementation(() => false);

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(1));

    await act(async () => {
      await result.current.deleteBoard("board-1", "Board 1");
    });

    expect(mockedBoardApi.delete).not.toHaveBeenCalled();
  });

  it("apaga o board quando o utilizador confirma", async () => {
    mockedBoardApi.getAll.mockResolvedValueOnce({ data: [makeBoard()] } as never);
    mockedBoardApi.delete.mockResolvedValue({} as never);
    // Após o delete, o backend já não devolve o board apagado
    mockedBoardApi.getAll.mockResolvedValueOnce({ data: [] } as never);

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(1));

    await act(async () => {
      await result.current.deleteBoard("board-1", "Board 1");
    });

    expect(mockedBoardApi.delete).toHaveBeenCalledWith("board-1");
    expect(result.current.activeBoard).toBeNull();
  });

  it("reordena boards de forma otimista e persiste no backend", async () => {
    const boardA = makeBoard({ id: "a", order: 1 });
    const boardB = makeBoard({ id: "b", order: 2 });
    mockedBoardApi.getAll.mockResolvedValue({ data: [boardA, boardB] } as never);
    mockedBoardApi.reorder.mockResolvedValue({} as never);

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(2));

    await act(async () => {
      await result.current.reorderBoards([boardB, boardA]);
    });

    expect(result.current.boards).toEqual([boardB, boardA]);
    expect(mockedBoardApi.reorder).toHaveBeenCalledWith(["b", "a"]);
  });

  it("reverte a reordenação de boards se a API falhar", async () => {
    const boardA = makeBoard({ id: "a", order: 1 });
    const boardB = makeBoard({ id: "b", order: 2 });
    mockedBoardApi.getAll.mockResolvedValue({ data: [boardA, boardB] } as never);
    mockedBoardApi.reorder.mockRejectedValue(new Error("falhou"));

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(2));

    await act(async () => {
      await result.current.reorderBoards([boardB, boardA]);
    });

    // loadBoards() é chamado para repor o estado real do servidor após a falha
    expect(mockedBoardApi.getAll).toHaveBeenCalledTimes(2);
  });

  it("reordena as colunas do board ativo e persiste no backend", async () => {
    const col1 = { id: "c1", name: "C1", color: "#3B82F6", order: 1, boardId: "board-1" };
    const col2 = { id: "c2", name: "C2", color: "#3B82F6", order: 2, boardId: "board-1" };
    const board = makeBoard({ columns: [col1, col2] });
    mockedBoardApi.getAll.mockResolvedValue({ data: [board] } as never);
    mockedColumnApi.reorder.mockResolvedValue({} as never);

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.activeBoard).not.toBeNull());

    await act(async () => {
      await result.current.reorderColumns([col2, col1]);
    });

    expect(result.current.activeBoard?.columns).toEqual([col2, col1]);
    expect(mockedColumnApi.reorder).toHaveBeenCalledWith("board-1", ["c2", "c1"]);
  });
});
