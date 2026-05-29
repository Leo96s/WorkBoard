"use client";

import { useState, useEffect } from "react";
import { TaskCard, BoardColumn } from "@/types";

interface Props {
  task?: TaskCard;
  columns: BoardColumn[];
  defaultColumnId: string;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    assignedTo: string;
    columnId: string;
  }) => void;
}

export default function TaskModal({ task, columns, defaultColumnId, onClose, onSave }: Props) {
  const [title, setTitle]           = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");
  const [columnId, setColumnId]     = useState(task?.columnId ?? defaultColumnId);

  // Sincroniza se a task mudar (edição)
  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setAssignedTo(task?.assignedTo ?? "");
    setColumnId(task?.columnId ?? defaultColumnId);
  }, [task, defaultColumnId]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, assignedTo, columnId });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          {task ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Título *
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Título da tarefa..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição opcional..."
            rows={3}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Responsável
            </label>
            <input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Nome..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Coluna
            </label>
            <select
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 transition"
          >
            {task ? "Guardar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}