import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useTasks } from "./useTasks";
import { taskApi } from "@/lib/api";
import type { TaskCard } from "@/types";

vi.mock("@/lib/api", () => ({
  taskApi: {
    filterByBoard: vi.fn(),
    filter: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    move: vi.fn(),
  },
}));

const mockedTaskApi = vi.mocked(taskApi);

function makeTask(overrides: Partial<TaskCard> = {}): TaskCard {
  return {
    id: "task-1",
    title: "Tarefa",
    description: "",
    assignedTo: "",
    columnId: "col-1",
    boardId: "board-1",
    createdAt: new Date().toISOString(),
    tags: [],
    ...overrides,
  };
}

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("carrega as tarefas do board ao montar", async () => {
    const tasks = [makeTask()];
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: tasks } as never);

    const { result } = renderHook(() => useTasks("board-1"));

    await waitFor(() => expect(result.current.tasks).toEqual(tasks));
    expect(mockedTaskApi.filterByBoard).toHaveBeenCalledWith("board-1");
  });

  it("mostra alerta e não rebenta quando loadTasks falha", async () => {
    mockedTaskApi.filterByBoard.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useTasks("board-1"));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(result.current.tasks).toEqual([]);
  });

  it("cria uma tarefa e recarrega a lista do board", async () => {
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: [] } as never);
    mockedTaskApi.create.mockResolvedValue({ data: makeTask() } as never);

    const { result } = renderHook(() => useTasks("board-1"));
    await waitFor(() => expect(mockedTaskApi.filterByBoard).toHaveBeenCalledTimes(1));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createTask({
        title: "Nova",
        description: "",
        assignedTo: "",
        boardId: "board-1",
        columnId: "col-1",
        tags: [],
      });
    });

    expect(ok).toBe(true);
    expect(mockedTaskApi.create).toHaveBeenCalledOnce();
    expect(mockedTaskApi.filterByBoard).toHaveBeenCalledTimes(2);
  });

  it("ao falhar a criação (ex: título demasiado longo), devolve false e mostra alerta em vez de rebentar (regressão)", async () => {
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: [] } as never);
    mockedTaskApi.create.mockRejectedValue(
      Object.assign(new Error("Request failed with status code 400"), {
        isAxiosError: true,
        response: {
          status: 400,
          data: { errors: { Title: ["The field Title must be a string with a maximum length of 200."] } },
        },
      })
    );

    const { result } = renderHook(() => useTasks("board-1"));
    await waitFor(() => expect(mockedTaskApi.filterByBoard).toHaveBeenCalledTimes(1));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.createTask({
        title: "x".repeat(300),
        description: "",
        assignedTo: "",
        boardId: "board-1",
        columnId: "col-1",
        tags: [],
      });
    });

    expect(ok).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("maximum length of 200")
    );
  });

  it("apaga uma tarefa localmente sem precisar de recarregar", async () => {
    const tasks = [makeTask({ id: "t1" }), makeTask({ id: "t2" })];
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: tasks } as never);
    mockedTaskApi.delete.mockResolvedValue({} as never);

    const { result } = renderHook(() => useTasks("board-1"));
    await waitFor(() => expect(result.current.tasks).toEqual(tasks));

    await act(async () => {
      await result.current.deleteTask("t1");
    });

    expect(result.current.tasks.map((t) => t.id)).toEqual(["t2"]);
  });

  it("move uma tarefa de forma otimista e mantém a mudança quando a API responde bem", async () => {
    const tasks = [makeTask({ id: "t1", columnId: "col-1" })];
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: tasks } as never);
    mockedTaskApi.move.mockResolvedValue({} as never);

    const { result } = renderHook(() => useTasks("board-1"));
    await waitFor(() => expect(result.current.tasks).toEqual(tasks));

    await act(async () => {
      await result.current.moveTask("t1", "col-2");
    });

    expect(result.current.tasks[0].columnId).toBe("col-2");
    expect(mockedTaskApi.move).toHaveBeenCalledWith("t1", "col-2");
  });

  it("reverte a mudança otimista e mostra alerta quando mover falha", async () => {
    const tasks = [makeTask({ id: "t1", columnId: "col-1" })];
    mockedTaskApi.filterByBoard.mockResolvedValue({ data: tasks } as never);
    mockedTaskApi.move.mockRejectedValue(new Error("falhou"));

    const { result } = renderHook(() => useTasks("board-1"));
    await waitFor(() => expect(result.current.tasks).toEqual(tasks));

    // A segunda chamada a filterByBoard (recarregar após falha) devolve o estado real do servidor
    mockedTaskApi.filterByBoard.mockResolvedValueOnce({ data: tasks } as never);

    await act(async () => {
      await result.current.moveTask("t1", "col-2");
    });

    expect(window.alert).toHaveBeenCalled();
    await waitFor(() => expect(result.current.tasks[0].columnId).toBe("col-1"));
  });
});
