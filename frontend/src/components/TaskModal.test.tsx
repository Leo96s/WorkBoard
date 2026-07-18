import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskModal from "./TaskModal";
import { LIMITS } from "@/lib/constants";

const baseProps = {
  title: "",
  description: "",
  assignedTo: "",
  columnId: "",
  tags: [],
  tagInput: "",
  columns: [],
  suggestedTags: [],
  showTagDropdown: false,
  onTitleChange: vi.fn(),
  onDescriptionChange: vi.fn(),
  onAssignedToChange: vi.fn(),
  onColumnIdChange: vi.fn(),
  onTagInputChange: vi.fn(),
  onAddTag: vi.fn(),
  onRemoveTag: vi.fn(),
  onShowTagDropdown: vi.fn(),
  onClose: vi.fn(),
  onSave: vi.fn(),
};

describe("TaskModal", () => {
  it("limita título, descrição e responsável aos tamanhos máximos aceites pelo backend (regressão: valores muito longos davam 400 não tratado)", () => {
    render(<TaskModal {...baseProps} />);

    expect(screen.getByPlaceholderText("Título da tarefa...")).toHaveAttribute(
      "maxLength",
      String(LIMITS.taskTitle)
    );
    expect(screen.getByPlaceholderText("Descrição opcional...")).toHaveAttribute(
      "maxLength",
      String(LIMITS.taskDescription)
    );
    expect(screen.getByPlaceholderText("Nome...")).toHaveAttribute(
      "maxLength",
      String(LIMITS.taskAssignedTo)
    );
  });

  it("limita o tamanho do input de nova tag", () => {
    render(<TaskModal {...baseProps} />);

    expect(screen.getByPlaceholderText("Nova tag ou pesquisar...")).toHaveAttribute(
      "maxLength",
      String(LIMITS.tagName)
    );
  });

  it("corta (truncate) uma tag já adicionada com nome muito longo em vez de estourar o layout (regressão)", () => {
    const longTag = "uma-tag-extremamente-longa-que-nao-deveria-caber-inteira-no-chip";
    render(<TaskModal {...baseProps} tags={[longTag]} />);

    const tagText = screen.getByText(longTag);
    expect(tagText.className).toContain("truncate");
  });
});
