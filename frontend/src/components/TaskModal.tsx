import { TaskCard, BoardColumn } from "@/types";
import { tagColor } from "@/lib/tagColor";
import { LIMITS } from "@/lib/constants";

interface Props {
  task?: TaskCard;
  title: string;
  description: string;
  assignedTo: string;
  columnId: string;
  tags: string[];
  tagInput: string;
  columns: BoardColumn[];
  suggestedTags: string[];
  showTagDropdown: boolean;

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAssignedToChange: (value: string) => void;
  onColumnIdChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: (tag?: string) => void;
  onRemoveTag: (tag: string) => void;
  onShowTagDropdown: (show: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}

/**
 * Modal para criar ou editar tarefa - Apresentação pura
 * Gerencia todo o formulário e interações com tags
 * Toda lógica de estado é gerida pelo parent
 */
export default function TaskModal({
  task,
  title,
  description,
  assignedTo,
  columnId,
  tags,
  tagInput,
  columns,
  suggestedTags,
  showTagDropdown,
  onTitleChange,
  onDescriptionChange,
  onAssignedToChange,
  onColumnIdChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onShowTagDropdown,
  onClose,
  onSave,
}: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          {task ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        {/* Título */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Título *
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            placeholder="Título da tarefa..."
            maxLength={LIMITS.taskTitle}
            className="border  text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descrição opcional..."
            rows={3}
            maxLength={LIMITS.taskDescription}
            className="border text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* Responsável e Coluna */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Responsável
            </label>
            <input
              value={assignedTo}
              onChange={(e) => onAssignedToChange(e.target.value)}
              placeholder="Nome..."
              maxLength={LIMITS.taskAssignedTo}
              className="border text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Coluna
            </label>
            <select
              value={columnId}
              onChange={(e) => onColumnIdChange(e.target.value)}
              className="border text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</label>

          {/* Tags já adicionadas */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex max-w-40 text-gray-900 items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagColor(tag)}`}
                >
                  <span className="truncate min-w-0" title={tag}>{tag}</span>
                  <button onClick={() => onRemoveTag(tag)} className="shrink-0 hover:opacity-60 transition">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input com dropdown de sugestões */}
          <div className="relative">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                onFocus={() => onShowTagDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddTag(tagInput);
                  }
                  if (e.key === "Escape") onShowTagDropdown(false);
                }}
                placeholder="Nova tag ou pesquisar..."
                maxLength={LIMITS.tagName}
                className="flex-1 border text-gray-900 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => onAddTag(tagInput)}
                disabled={!tagInput.trim()}
                className="px-3 py-2 text-sm text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 transition"
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
                    onClick={() => onAddTag(tag)}
                    className="block text-gray-900 w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40"
          >
            {task ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}