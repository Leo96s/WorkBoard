"use client";

import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { boardApi, taskApi, columnApi } from "@/lib/api";
import { Board, TaskCard } from "@/types";

import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModal";
import BoardModal from "@/components/BoardModal";

/**
 * Página principal do aplicativo Kanban
 * Gerencia boards, colunas e tarefas com suporte a drag and drop
 */
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

  /**
   * Carrega todos os boards e define o board ativo
   */
  const loadBoards = async () => {
    const res = await boardApi.getAll();
    setBoards(res.data);

    if (res.data.length > 0) {
      if (!activeBoard) {
        setActiveBoard(res.data[0]);
      } else {
        const fresh = res.data.find((b: Board) => b.id === activeBoard.id);
        setActiveBoard(fresh ?? res.data[0]);
      }
    }
  };

  /**
   * Carrega as tarefas de um board específico
   * @param {string} boardId - ID do board
   */
  const loadTasks = async (boardId: string) => {
    const res = await taskApi.filterByBoard(boardId);
    setTasks(res.data);
  };

  useEffect(() => { loadBoards(); }, []);
  useEffect(() => { if (activeBoard) loadTasks(activeBoard.id); }, [activeBoard]);

  /**
   * Listener para fechar dropdown ao clicar fora
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBoardDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adicionar estado
const [globalTags, setGlobalTags] = useState<string[]>([]);

/**
 * Mescla novas tags nas tags globais
 * @param {string[]} newTags - Tags a adicionar
 */
const mergeGlobalTags = (newTags: string[]) => {
  setGlobalTags(prev => {
    const merged = [...prev];
    newTags.forEach(t => { if (!merged.includes(t)) merged.push(t); });
    return merged;
  });
};

  /**
   * Gerencia o fim do drag and drop (reordenação ou movimento de tarefas)
   * @param {DropResult} result - Resultado do drag
   */
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "BOARD") {
      const reordered = Array.from(boards);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setBoards(reordered);
      return;
    }

    if (type === "COLUMN") {
      if (!activeBoard) return;
      const reordered = Array.from(activeBoard.columns);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setActiveBoard({ ...activeBoard, columns: reordered });
      return;
    }

    if (!activeBoard) return;
    setTasks(prev =>
      prev.map(t => t.id === draggableId ? { ...t, columnId: destination.droppableId } : t)
    );
    await taskApi.move(draggableId, destination.droppableId);
  };

  /**
   * Cria um novo board
   * @param {string} name - Nome do novo board
   */
  const handleCreateBoard = async (name: string) => {
    await boardApi.create({ name });
    setBoardModalOpen(false);
    await loadBoards();
  };

  /**
   * Deleta um board e suas tarefas/colunas
   * @param {string} boardId - ID do board
   * @param {string} boardName - Nome do board (para confirmação)
   */
  const handleDeleteBoard = async (boardId: string, boardName: string) => {
    if (!confirm(`Apagar "${boardName}"? Todas as tarefas e colunas serão eliminadas.`)) return;
    try {
      await boardApi.delete(boardId);
      // Se apagámos o board ativo, limpar o estado antes de recarregar
      if (activeBoard?.id === boardId) {
        setActiveBoard(null);
        setTasks([]);
      }
      await loadBoards();
    } catch {
      alert("Não foi possível apagar o board.");
    }
  };

  /**
   * Cria uma nova coluna no board ativo
   * @param {string} name - Nome da coluna
   * @param {string} color - Cor da coluna (formato hex)
   */
  const handleCreateColumn = async (name: string, color: string) => {
    if (!activeBoard) return;
    await columnApi.create(activeBoard.id, { name, color });
    await loadBoards();
  };

  /**
   * Deleta uma coluna do board ativo
   * @param {string} columnId - ID da coluna
   */
  const handleDeleteColumn = async (columnId: string) => {
    if (!activeBoard) return;
    try {
      await columnApi.delete(activeBoard.id, columnId);
      await loadBoards();
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      alert("Erro ao deletar coluna");
    }
  };

  const columns = activeBoard?.columns ?? [];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col h-full">

        <DragDropContext onDragEnd={handleDragEnd}>

          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">

              {/* DROPDOWN DE BOARDS */}
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
                    <Droppable droppableId="boards-list" type="BOARD">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="max-h-96 overflow-y-auto py-1"
                        >
                          {boards.map((board, index) => (
                            <Draggable key={board.id} draggableId={`board-${board.id}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-2 px-3 py-2 transition
                                    ${snapshot.isDragging ? "bg-blue-50 shadow-md rounded-lg" : "hover:bg-gray-50"}
                                    ${activeBoard?.id === board.id ? "text-blue-600 font-semibold" : "text-gray-700"}`}
                                >
                                  {/* Handle de drag */}
                                  <span
                                    {...provided.dragHandleProps}
                                    className="text-gray-300 hover:text-gray-500 cursor-grab text-sm select-none"
                                  >
                                    ⠿
                                  </span>

                                  {/* Nome do board */}
                                  <button
                                    onClick={() => {
                                      setActiveBoard(board);
                                      setBoardDropdownOpen(false);
                                    }}
                                    className="flex-1 text-left text-sm"
                                  >
                                    {board.name}
                                  </button>

                                  {/* Botão apagar — só aparece se houver mais de 1 board */}
                                  {boards.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBoardDropdownOpen(false);
                                        handleDeleteBoard(board.id, board.name);
                                      }}
                                      title="Apagar board"
                                      className="text-gray-300 hover:text-red-400 transition text-sm px-1 flex-shrink-0"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>

              {/* BOTÃO CRIAR BOARD */}
              <button
                onClick={() => setBoardModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                + Board
              </button>
            </div>

            <h1 className="text-3xl font-bold">{activeBoard?.name ?? "Boards"}</h1>
          </div>

          {/* KANBAN */}
          <div className="overflow-x-auto pb-6 flex-1">
            <Droppable droppableId="columns-list" direction="horizontal" type="COLUMN">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-6 min-w-max"
                >
                  {columns.map((col, index) => (
                    <Draggable key={col.id} draggableId={`col-${col.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`shrink-0 w-80 transition ${snapshot.isDragging ? "opacity-90 rotate-1" : ""}`}
                        >
                          <KanbanColumn
                            column={col}
                            tasks={tasks.filter(t => t.columnId === col.id)}
                            columns={columns}
                            dragHandleProps={provided.dragHandleProps}
                            onAdd={() => setModalOpen(true)}
                            onEdit={(t) => {
                              setEditingTask(t);
                              setModalOpen(true);
                            }}
                            onDelete={async (id) => {
                              await taskApi.delete(id);
                              setTasks(prev => prev.filter(t => t.id !== id));
                            }}
                            onMove={(id, columnId) => taskApi.move(id, columnId)}
                            onDeleteColumn={() => handleDeleteColumn(col.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* BOTÃO NOVA COLUNA */}
                  <div className="shrink-0 w-80 flex items-start">
                    <button
                      onClick={() => setColumnModalOpen(true)}
                      className="h-[600px] w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition"
                    >
                      <div className="text-center">
                        <div className="text-4xl text-gray-300 mb-2">+</div>
                        <div className="text-gray-500 font-semibold">Nova Coluna</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          </div>

        </DragDropContext>
      </div>

      {/* TASK MODAL */}
      {modalOpen && activeBoard && (
        <TaskModal
          task={editingTask}
          columns={columns}
          defaultColumnId={columns[0]?.id || ""}
          globalTags={globalTags}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(undefined);
          }}
          onSave={async (data) => {
  if (editingTask) {
    await taskApi.update(editingTask.id, data);
  } else {
    await taskApi.create({ ...data, boardId: activeBoard.id });
  }
  mergeGlobalTags(data.tags); // ← adicionar
  await loadTasks(activeBoard.id);
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
                  handleCreateColumn(newColumnName.trim(), colors[Math.floor(Math.random() * colors.length)]);
                  setNewColumnName("");
                  setColumnModalOpen(false);
                }
              }}
              placeholder="Nome da coluna..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setNewColumnName(""); setColumnModalOpen(false); }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newColumnName.trim()) {
                    const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
                    handleCreateColumn(newColumnName.trim(), colors[Math.floor(Math.random() * colors.length)]);
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