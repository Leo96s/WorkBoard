"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useBoards } from "@/lib/hooks/useBoards";
import { useTasks } from "@/lib/hooks/useTasks";
import { useColumns } from "@/lib/hooks/useColumns";
import { useModals } from "@/lib/hooks/useModals";
import { useBoardDropdown } from "@/lib/hooks/useBoardDropdown";
import { useDragEnd } from "@/lib/hooks/useDragEnd";
import { useTags } from "@/lib/hooks/useTags";
import { filterSuggestedTags, addTag, removeTag } from "@/lib/utils/tagHelpers";

import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModal";
import BoardModal from "@/components/BoardModal";

/**
 * Página principal do aplicativo Kanban
 * Gerencia boards, colunas e tarefas com suporte a drag and drop
 */
export default function Home() {
  // Hooks para gestão de estado
  const {
    boards,
    activeBoard,
    setActiveBoard,
    createBoard,
    deleteBoard,    loadBoards,  } = useBoards();

  const {
    tasks,
    loadTasks,
    searchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    updateTaskLocally,
  } = useTasks(activeBoard?.id ?? null);

  const { createColumn, deleteColumn } = useColumns();
  const { globalTags, mergeGlobalTags } = useTags();

  const [assignedToFilter, setAssignedToFilter] = useState("");

  const {
    taskModalOpen,
    setTaskModalOpen,
    editingTask,
    setEditingTask,
    openNewTaskModal,
    openEditTaskModal,
    closeTaskModal,
    boardModalOpen,
    openBoardModal,
    closeBoardModal,
    columnModalOpen,
    openColumnModal,
    closeColumnModal,
    newColumnName,
    setNewColumnName,
  } = useModals();

  const {
    boardDropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRef,
  } = useBoardDropdown();

  const { handleDragEnd: onDragEnd } = useDragEnd();

  const columns = activeBoard?.columns ?? [];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col h-full">
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, {
              boards,
              setBoards: () => {},
              activeBoard,
              setActiveBoard,
              tasks,
              updateTaskLocally,
            })
          }
        >
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
              {/* DROPDOWN DE BOARDS */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={toggleDropdown}
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
                                  <span
                                    {...provided.dragHandleProps}
                                    className="text-gray-300 hover:text-gray-500 cursor-grab text-sm select-none"
                                  >
                                    ⠿
                                  </span>

                                  <button
                                    onClick={() => {
                                      setActiveBoard(board);
                                      closeDropdown();
                                    }}
                                    className="flex-1 text-left text-sm"
                                  >
                                    {board.name}
                                  </button>

                                  {boards.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeDropdown();
                                        deleteBoard(board.id, board.name);
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
                onClick={openBoardModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                + Board
              </button>
            </div>

            <h1 className="text-3xl text-gray-900 font-bold">{activeBoard?.name ?? "Boards"}</h1>
          </div>
          <input
  type="text"
  placeholder="Pesquisar responsável ou tag..."
  value={assignedToFilter}
  onChange={async (e) => {
    const value = e.target.value;

    setAssignedToFilter(value);

    if (!activeBoard) return;

    if (value.trim() === "") {
      await loadTasks(activeBoard.id);
    } else {
      await searchTasks(activeBoard.id, value);
    }
  }}
  className="w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
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
                            tasks={tasks.filter((t) => t.columnId === col.id)}
                            columns={columns}
                            dragHandleProps={provided.dragHandleProps}
                            onAdd={openNewTaskModal}
                            onEdit={openEditTaskModal}
                            onDelete={async (id) => {
                              await deleteTask(id);
                            }}
                            onMove={moveTask}
                            onDeleteColumn={() => {
                              if (activeBoard) {
                                deleteColumn(activeBoard.id, col.id).then(() => {
                                  if (activeBoard) {
                                    loadBoards();
                                    loadTasks(activeBoard.id);
                                  }
                                });
                              }
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* BOTÃO NOVA COLUNA */}
                  <div className="shrink-0 w-80 flex items-start">
                    <button
                      onClick={openColumnModal}
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
      {taskModalOpen && activeBoard && (
        <TaskModalWithLogic
          task={editingTask}
          columns={columns}
          globalTags={globalTags}
          onClose={closeTaskModal}
          onSave={async (data) => {
            if (editingTask) {
              await updateTask(editingTask.id, data);
            } else {
              await createTask({ ...data, boardId: activeBoard.id });
            }
            mergeGlobalTags(data.tags);
            setTaskModalOpen(false);
            setEditingTask(undefined);
          }}
        />
      )}

      {/* BOARD MODAL */}
      {boardModalOpen && (
        <BoardModalWithLogic
          onClose={closeBoardModal}
          onSave={async (name) => {
            await createBoard(name);
            closeBoardModal();
          }}
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
                  handleCreateColumnConfirm();
                }
              }}
              placeholder="Nome da coluna..."
              className="w-full border text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNewColumnName("");
                  closeColumnModal();
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateColumnConfirm}
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

  async function handleCreateColumnConfirm() {
    if (activeBoard && newColumnName.trim()) {
      await createColumn(activeBoard.id, newColumnName.trim());
      await loadBoards();
      await loadTasks(activeBoard.id);
      setNewColumnName("");
      closeColumnModal();
    }
  }
}

// Wrapper do TaskModal para gerir estado local do modal
function TaskModalWithLogic({
  task,
  columns,
  globalTags,
  onClose,
  onSave,
}: Readonly<{
  task: any;
  columns: Array<any>;
  globalTags: string[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}>) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");
  const [columnId, setColumnId] = useState(task?.columnId ?? (columns[0]?.id || ""));
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setAssignedTo(task?.assignedTo ?? "");
    setColumnId(task?.columnId ?? (columns[0]?.id || ""));
    setTags(task?.tags ?? []);
    setTagInput("");
    setShowTagDropdown(false);
  }, [task, columns]);

  const suggestedTags = filterSuggestedTags(globalTags, tagInput, tags);

  return (
    <TaskModal
      task={task}
      title={title}
      description={description}
      assignedTo={assignedTo}
      columnId={columnId}
      tags={tags}
      tagInput={tagInput}
      columns={columns}
      suggestedTags={suggestedTags}
      showTagDropdown={showTagDropdown}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onAssignedToChange={setAssignedTo}
      onColumnIdChange={setColumnId}
      onTagInputChange={(val) => {
        setTagInput(val);
        setShowTagDropdown(true);
      }}
      onAddTag={(tag?: string) => {
        const newTags = addTag(tags, tag ?? tagInput);
        setTags(newTags);
        setTagInput("");
        setShowTagDropdown(false);
      }}
      onRemoveTag={(tag) => {
        setTags(removeTag(tags, tag));
      }}
      onShowTagDropdown={setShowTagDropdown}
      onClose={onClose}
      onSave={async () => {
        if (!title.trim()) return;
        await onSave({ title: title.trim(), description, assignedTo, columnId, tags });
      }}
    />
  );
}

// Wrapper do BoardModal para gerenciar estado local
function BoardModalWithLogic({
  onClose,
  onSave,
}: Readonly<{
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}>) {
  const [name, setName] = useState("");

  return (
    <BoardModal
      name={name}
      onNameChange={setName}
      onClose={onClose}
      onSave={async () => {
        if (name.trim()) {
          await onSave(name.trim());
        }
      }}
    />
  );
}