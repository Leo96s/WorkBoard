"use client";

import { useEffect, useState, useRef } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { boardApi, taskApi, columnApi } from "@/lib/api";
import { Board, TaskCard } from "@/types";

import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModal";
import BoardModal from "@/components/BoardModal";

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCard | undefined>();
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // LOAD BOARDS
  const loadBoards = async () => {
  const res = await boardApi.getAll();
  setBoards(res.data);

  if (res.data.length > 0) {
    if (!activeBoard) {
      setActiveBoard(res.data[0]);
    } else {
      // Re-sincroniza o activeBoard com os dados frescos do servidor
      const fresh = res.data.find((b: Board) => b.id === activeBoard.id);
      setActiveBoard(fresh ?? res.data[0]);
    }
  }
};

  // LOAD TASKS BY BOARD
  const loadTasks = async (boardId: string) => {
    const res = await taskApi.filterByBoard(boardId);
    setTasks(res.data);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (activeBoard) loadTasks(activeBoard.id);
  }, [activeBoard]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !activeBoard) return;

    const taskId = result.draggableId;
    const newColumnId = result.destination.droppableId;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, columnId: newColumnId } : t
      )
    );

    await taskApi.move(taskId, newColumnId);
  };

  const handleCreateBoard = async (name: string) => {
    await boardApi.create({ name });
    setBoardModalOpen(false);
    await loadBoards();
  };

  const handleCreateColumn = async (name: string, color: string) => {
    if (!activeBoard) return;
    await columnApi.create(activeBoard.id, { name, color });
    await loadBoards();
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!activeBoard) return;
    try {
      console.log("Deletando coluna:", { boardId: activeBoard.id, columnId });
      await columnApi.delete(activeBoard.id, columnId);
      await loadBoards();
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      alert("Erro ao deletar coluna");
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBoardDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns = activeBoard?.columns ?? [];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col h-full">

        {/* HEADER COM SELETOR E BOTÃO DE NOVO BOARD */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {/* DROPDOWN DE SELEÇÃO DE BOARDS */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setBoardDropdownOpen(!boardDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 border border-gray-200"
              >
                <span>{activeBoard?.name ?? "Selecionar Board"}</span>
                <span className="text-xs">▼</span>
              </button>

              {boardDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
                  <div className="max-h-96 overflow-y-auto">
                    {boards.map(board => (
                      <button
                        key={board.id}
                        onClick={() => {
                          setActiveBoard(board);
                          setBoardDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          activeBoard?.id === board.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"
                        }`}
                      >
                        {board.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTÃO CRIAR NOVO BOARD */}
            <button
              onClick={() => setBoardModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              title="Criar novo board"
            >
              + Board
            </button>
          </div>

          <h1 className="text-3xl font-bold">
            {activeBoard?.name ?? "Boards"}
          </h1>
        </div>

        {/* KANBAN BOARD */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 flex-1">
            {columns.map(col => (
              <div key={col.id} className="shrink-0 w-80">
                <KanbanColumn
                  column={col}
                  tasks={tasks.filter(t => t.columnId === col.id)}
                  columns={columns}
                  onAdd={() => setModalOpen(true)}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={async (id) => {
                  await taskApi.delete(id);
                  setTasks((prev) => prev.filter((t) => t.id !== id));
                  }}
                  onMove={(id, columnId) => taskApi.move(id, columnId)}
                  onDeleteColumn={() => handleDeleteColumn(col.id)}
                />
              </div>
            ))}

            {/* BOTÃO PARA CRIAR NOVA COLUNA */}
            <div className="shrink-0 w-80 flex items-center justify-center">
              <button
                onClick={() => setColumnModalOpen(true)}
                className="h-80 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition"
                title="Criar nova coluna"
              >
                <div className="text-center">
                  <div className="text-4xl text-gray-300 mb-2">+</div>
                  <div className="text-gray-500 font-semibold">Nova Coluna</div>
                </div>
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* TASK MODAL */}
      {modalOpen && activeBoard && (
        <TaskModal
          task={editingTask}
          columns={columns}
          defaultColumnId={columns[0]?.id || ""}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(undefined);
          }}
          onSave={async (data) => {
  if (activeBoard) {
    await taskApi.create({
      ...data,
      boardId: activeBoard.id,
    });
    await loadTasks(activeBoard.id);
  }
  setModalOpen(false);
  setEditingTask(undefined);
}}
        />
      )}

      {/* BOARD MODAL */}
      {boardModalOpen && (
        <BoardModal
          onClose={() => setBoardModalOpen(false)}
          onSave={handleCreateBoard}
        />
      )}

      {/* COLUMN MODAL */}
      {columnModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[380px] p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Nova Coluna</h2>

            <input
              autoFocus
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newColumnName.trim()) {
                  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  handleCreateColumn(newColumnName.trim(), color);
                  setNewColumnName("");
                  setColumnModalOpen(false);
                }
              }}
              placeholder="Nome da coluna..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNewColumnName("");
                  setColumnModalOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newColumnName.trim()) {
                    const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    handleCreateColumn(newColumnName.trim(), color);
                    setNewColumnName("");
                    setColumnModalOpen(false);
                  }
                }}
                disabled={!newColumnName.trim()}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}