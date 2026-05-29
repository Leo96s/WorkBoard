"use client";
import { TaskCard as ITaskCard, COLUMN_LABELS, Column } from "@/types";

interface Props {
  task: ITaskCard;
  onEdit: (task: ITaskCard) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, column: Column) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const columns: Column[] = [1, 2, 3];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-2 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-black">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-xs px-2 py-1 rounded bg-gray hover:bg-gray-200 transition"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-800">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          👤 {task.assignedTo}
        </span>
        <span className="text-xs text-gray-800">
          {new Date(task.createdAt).toLocaleDateString("pt-PT")}
        </span>
      </div>

      <select
        className="mt-1 text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={task.column}
        onChange={e => onMove(task.id, Number(e.target.value) as Column)}
      >
        {columns.map(col => (
          <option key={col} value={col}>
            {COLUMN_LABELS[col]}
          </option>
        ))}
      </select>
    </div>
  );
}