import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BoardModal from "./BoardModal";
import { LIMITS } from "@/lib/constants";

describe("BoardModal", () => {
  it("limita o input de nome ao tamanho máximo aceite pelo backend (regressão: nome muito longo dava 400 não tratado)", () => {
    render(
      <BoardModal name="" onNameChange={vi.fn()} onClose={vi.fn()} onSave={vi.fn()} />
    );

    const input = screen.getByPlaceholderText("Nome do board...");
    expect(input).toHaveAttribute("maxLength", String(LIMITS.boardName));
  });
});
