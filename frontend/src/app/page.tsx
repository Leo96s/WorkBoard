"use client";
import { useEffect, useState } from "react";
import { TaskCard, Column, CreateTaskDto, UpdateTaskDto } from "@/types";
import { taskApi } from "@/lib/api";
import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModal";

export default function Home() {
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [filterAssignedTo, setFilterAssignedTo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCard | undefined>();
  const [defaultColumn, setDefaultColumn] = useState<Column>(1);

  const fetchTasks = async () => {
    const res = filterAssignedTo
      ? await taskApi.filter({ assignedTo: filterAssignedTo })
      : await taskApi.getAll();
    setTasks(res.data);
  };

  useEffect(() => {
    const fetch = async () => {
      const res = filterAssignedTo
        ? await taskApi.filter({ assignedTo: filterAssignedTo })
        : await taskApi.getAll();
      setTasks(res.data);
    };

    void fetch();
  }, [filterAssignedTo]);

  const handleSave = async (data: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      await taskApi.update(editingTask.id, data as UpdateTaskDto);
    } else {
      await taskApi.create({ ...data as CreateTaskDto });
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
    setDefaultColumn(column);
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
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterAssignedTo}
            onChange={e => setFilterAssignedTo(e.target.value)}
          />
        </div>

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