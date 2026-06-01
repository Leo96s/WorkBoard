interface Props {
  name: string;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

/**
 * Modal para criar um novo board - Apresentação pura
 * Toda lógica é gerenciada pelo parent
 */
export default function BoardModal({ name, onNameChange, onClose, onSave }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[380px] p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Novo Board</h2>

        <input
          autoFocus
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onSave()}
          placeholder="Nome do board..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}