"use client";

import { useState, useEffect } from "react";
import { TaskCard, BoardColumn } from "@/types";
import { tagColor } from "@/lib/tagColor";

interface Props {
  task?: TaskCard;
  columns: BoardColumn[];
  defaultColumnId: string;
  globalTags: string[];
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    assignedTo: string;
    columnId: string;
    tags: string[];
  }) => void;
}

/**
 * Modal para criar ou editar uma tarefa
 * @param {TaskCard} [task] - Tarefa a editar (opcional, novo se não fornecido)
 * @param {BoardColumn[]} columns - Lista de colunas disponíveis
 * @param {string} defaultColumnId - ID da coluna padrão para novas tarefas
 * @param {string[]} globalTags - Tags globais disponíveis para sugestão
 * @param {Function} onClose - Função chamada ao fechar o modal
 * @param {Function} onSave - Função chamada ao salvar a tarefa com seus dados
 */
export default function TaskModal({  task, columns, defaultColumnId, globalTags, onClose, onSave }: Props) {
  const [title, setTitle]           = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");
  const [columnId, setColumnId]     = useState(task?.columnId ?? defaultColumnId);
  const [tags, setTags]               = useState<string[]>(task?.tags ?? []);
  const [tagInput, setTagInput]       = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const suggestedTags = globalTags.filter(
    tag => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  /**
   * Sincroniza o estado do modal quando a tarefa a editar muda
   */
  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setAssignedTo(task?.assignedTo ?? "");
    setColumnId(task?.columnId ?? defaultColumnId);
    setTags(task?.tags ?? []);
    setTagInput("");
    setShowTagDropdown(false);
  }, [task, defaultColumnId]);

  /**
   * Adiciona uma nova tag à tarefa
   * @param {string} [tagToAdd] - Tag a adicionar (ou usa tagInput se não fornecido)
   */
  const addTag = (tagToAdd?: string) => {
    const trimmed = (tagToAdd ?? tagInput).trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags(prev => [...prev, trimmed]);
    setTagInput(\"\");
    setShowTagDropdown(false);
  };

  /**
   * Remove uma tag da tarefa
   * @param {string} tag - Tag a remover
   */
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  /**
   * Salva a tarefa se o título for válido
   */
  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, assignedTo, columnId, tags });
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

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</label>

          {/* Tags já adicionadas */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagColor(tag)}`}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:opacity-60 transition">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Input com dropdown de sugestões */}
          <div className="relative">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowTagDropdown(true);
                }}
                onFocus={() => setShowTagDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
                  if (e.key === "Escape") setShowTagDropdown(false);
                }}
                placeholder="Nova tag ou pesquisar..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => addTag(tagInput)}
                disabled={!tagInput.trim()}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 transition"
              >
                + Adicionar
              </button>
            </div>

            {/* Dropdown de tags existentes */}
            {showTagDropdown && suggestedTags.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onMouseDown={(e) => { e.preventDefault(); addTag(tag); }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColor(tag)}`}>
                      {tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
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