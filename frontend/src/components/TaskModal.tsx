"use client";
import { useState } from "react";
import { TaskCard, CreateTaskDto, UpdateTaskDto } from "@/types";

interface Props {
  task?: TaskCard;
  onClose: () => void;
  onSave: (data: CreateTaskDto | UpdateTaskDto) => void;
}

export default function TaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");

  const handleSubmit = () => {
    if (!title.trim() || !assignedTo.trim()) return;
    onSave({ title, description, assignedTo });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {task ? "✏️ Editar Cartão" : "➕ Novo Cartão"}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Título <span className="text-red-500">*</span></label>
            <input
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              placeholder="Ex: Implementar login"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Descrição</label>
            <textarea
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
              placeholder="Ex: Criar formulário de autenticação..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Responsável <span className="text-red-500">*</span></label>
            <input
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              placeholder="Ex: Leonardo"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !assignedTo.trim()}
            className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}