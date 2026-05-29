"use client";
import { Draggable } from "@hello-pangea/dnd";
import { TaskCard as ITaskCard, COLUMN_LABELS, Column } from "@/types";

interface Props {
  task: ITaskCard;
  index: number;
  onEdit: (task: ITaskCard) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, column: Column) => void;
}

export default function TaskCard({ task, index, onEdit, onDelete, onMove }: Props) {
  const columns: Column[] = [1, 2, 3];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-2 transition
            ${snapshot.isDragging ? "shadow-xl rotate-1 scale-105 border-blue-400" : "hover:shadow-md"}`}
        >
          {/* Handle de drag separado */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 flex-1">
              <span
                {...provided.dragHandleProps}
                className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing text-lg select-none"
                title="Arrastar"
              >⠿</span>
              <h3 className="font-semibold text-gray-800">{task.title}</h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(task)}
                className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
              >✏️</button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition"
              >🗑️</button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              👤 {task.assignedTo}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleDateString("pt-PT")}
            </span>
          </div>

          {/* Dropdown para mover */}
          <select
            className="mt-1 text-xs border-2 border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-blue-400 transition"
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
      )}
    </Draggable>
  );
}