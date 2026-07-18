import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { DropResult } from "@hello-pangea/dnd";
import { useDragEnd } from "./useDragEnd";
import { Board, BoardColumn } from "@/types";

function makeBoard(id: string, columns: BoardColumn[] = []): Board {
  return { id, name: `Board ${id}`, order: 0, columns };
}

function makeColumn(id: string, boardId: string, order: number): BoardColumn {
  return { id, name: `Col ${id}`, color: "#3B82F6", order, boardId };
}

function makeResult(overrides: Partial<DropResult>): DropResult {
  return {
    draggableId: "task-1",
    type: "TASK",
    source: { droppableId: "col-1", index: 0 },
    destination: { droppableId: "col-2", index: 0 },
    reason: "DROP",
    mode: "FLUID",
    combine: null,
    ...overrides,
  } as DropResult;
}

describe("useDragEnd", () => {
  it("não faz nada quando não há destino (largou fora de uma zona válida)", async () => {
    const { result } = renderHook(() => useDragEnd());
    const onReorderBoards = vi.fn();
    const onReorderColumns = vi.fn();
    const moveTask = vi.fn();

    await result.current.handleDragEnd(makeResult({ destination: null }), {
      boards: [],
      activeBoard: null,
      onReorderBoards,
      onReorderColumns,
      moveTask,
    });

    expect(onReorderBoards).not.toHaveBeenCalled();
    expect(onReorderColumns).not.toHaveBeenCalled();
    expect(moveTask).not.toHaveBeenCalled();
  });

  it("não faz nada quando largou na mesma posição de onde saiu", async () => {
    const { result } = renderHook(() => useDragEnd());
    const moveTask = vi.fn();

    await result.current.handleDragEnd(
      makeResult({
        source: { droppableId: "col-1", index: 2 },
        destination: { droppableId: "col-1", index: 2 },
      }),
      {
        boards: [],
        activeBoard: null,
        onReorderBoards: vi.fn(),
        onReorderColumns: vi.fn(),
        moveTask,
      }
    );

    expect(moveTask).not.toHaveBeenCalled();
  });

  it("reordena boards e chama onReorderBoards com a nova ordem", async () => {
    const { result } = renderHook(() => useDragEnd());
    const boardA = makeBoard("a");
    const boardB = makeBoard("b");
    const boardC = makeBoard("c");
    const onReorderBoards = vi.fn();

    await result.current.handleDragEnd(
      makeResult({
        type: "BOARD",
        source: { droppableId: "boards-list", index: 0 },
        destination: { droppableId: "boards-list", index: 2 },
      }),
      {
        boards: [boardA, boardB, boardC],
        activeBoard: null,
        onReorderBoards,
        onReorderColumns: vi.fn(),
        moveTask: vi.fn(),
      }
    );

    expect(onReorderBoards).toHaveBeenCalledWith([boardB, boardC, boardA]);
  });

  it("reordena colunas do board ativo e chama onReorderColumns", async () => {
    const { result } = renderHook(() => useDragEnd());
    const col1 = makeColumn("1", "board-1", 1);
    const col2 = makeColumn("2", "board-1", 2);
    const activeBoard = makeBoard("board-1", [col1, col2]);
    const onReorderColumns = vi.fn();

    await result.current.handleDragEnd(
      makeResult({
        type: "COLUMN",
        source: { droppableId: "columns-list", index: 0 },
        destination: { droppableId: "columns-list", index: 1 },
      }),
      {
        boards: [],
        activeBoard,
        onReorderBoards: vi.fn(),
        onReorderColumns,
        moveTask: vi.fn(),
      }
    );

    expect(onReorderColumns).toHaveBeenCalledWith([col2, col1]);
  });

  it("não reordena colunas se não houver board ativo", async () => {
    const { result } = renderHook(() => useDragEnd());
    const onReorderColumns = vi.fn();

    await result.current.handleDragEnd(makeResult({ type: "COLUMN" }), {
      boards: [],
      activeBoard: null,
      onReorderBoards: vi.fn(),
      onReorderColumns,
      moveTask: vi.fn(),
    });

    expect(onReorderColumns).not.toHaveBeenCalled();
  });

  it("move uma tarefa para a coluna de destino", async () => {
    const { result } = renderHook(() => useDragEnd());
    const activeBoard = makeBoard("board-1");
    const moveTask = vi.fn();

    await result.current.handleDragEnd(
      makeResult({
        draggableId: "task-42",
        destination: { droppableId: "col-destino", index: 0 },
      }),
      {
        boards: [],
        activeBoard,
        onReorderBoards: vi.fn(),
        onReorderColumns: vi.fn(),
        moveTask,
      }
    );

    expect(moveTask).toHaveBeenCalledWith("task-42", "col-destino");
  });

  it("não move tarefa se não houver board ativo", async () => {
    const { result } = renderHook(() => useDragEnd());
    const moveTask = vi.fn();

    await result.current.handleDragEnd(makeResult({}), {
      boards: [],
      activeBoard: null,
      onReorderBoards: vi.fn(),
      onReorderColumns: vi.fn(),
      moveTask,
    });

    expect(moveTask).not.toHaveBeenCalled();
  });
});
