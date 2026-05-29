"use client";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { TaskCard, Column, CreateTaskDto, UpdateTaskDto } from "@/types";
import { taskApi } from "@/lib/api";
import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModal";

export default function Home() {
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [filterAssignedTo, setFilterAssignedTo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCard | undefined>();

  const fetchTasks = async () => {
    const res = filterAssignedTo
      ? await taskApi.filter({ assignedTo: filterAssignedTo })
      : await taskApi.getAll();
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, [filterAssignedTo]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newColumn = Number(result.destination.droppableId) as Column;
    const task = tasks.find(t => t.id === taskId);

    if (!task || task.column === newColumn) return;

    // Atualiza UI imediatamente (optimistic update)
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, column: newColumn } : t)
    );

    // Envia para o backend
    await taskApi.move(taskId, newColumn);
  };

  const handleSave = async (data: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      await taskApi.update(editingTask.id, data as UpdateTaskDto);
    } else {
      await taskApi.create(data as CreateTaskDto);
    }
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apagar este cartão?")) {
      await taskApi.delete(id);
      fetchTasks();
    }
  };

  const handleMove = async (id: string, column: Column) => {
    await taskApi.move(id, column);
    fetchTasks();
  };

  const openCreate = (column: Column) => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const openEdit = (task: TaskCard) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const columns: Column[] = [1, 2, 3];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">WorkBoard 📋</h1>
          <input
            type="text"
            placeholder="🔍 Filtrar por responsável..."
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-64 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            value={filterAssignedTo}
            onChange={e => setFilterAssignedTo(e.target.value)}
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(col => (
              <KanbanColumn
                key={col}
                column={col}
                tasks={tasks.filter(t => t.column === col)}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMove={handleMove}
                onAdd={() => openCreate(col)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}