import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { TaskCard as ITaskCard } from "@/types";

function renderTaskCard(task: ITaskCard) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="col-1">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TaskCard task={task} index={0} columns={[]} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function makeTask(overrides: Partial<ITaskCard> = {}): ITaskCard {
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

describe("TaskCard", () => {
  it("corta (truncate) um responsável com nome muito longo em vez de estourar o layout (regressão)", () => {
    const task = makeTask({ assignedTo: "Um Nome de Responsável Extremamente Longo Que Não Deveria Caber" });
    renderTaskCard(task);

    const assignedToEl = screen.getByText(
      (_, el) => el?.tagName === "SPAN" && (el.textContent?.includes("Um Nome de Responsável") ?? false)
    );
    expect(assignedToEl.className).toContain("truncate");
    expect(assignedToEl.className).toContain("min-w-0");
  });

  it("limita a largura de uma tag muito longa em vez de estourar o layout (regressão)", () => {
    const task = makeTask({ tags: ["uma-tag-extremamente-longa-que-nao-deveria-caber-inteira"] });
    renderTaskCard(task);

    const tagEl = screen.getByText("uma-tag-extremamente-longa-que-nao-deveria-caber-inteira");
    expect(tagEl.className).toContain("truncate");
    expect(tagEl.className).toContain("max-w-");
  });
});
