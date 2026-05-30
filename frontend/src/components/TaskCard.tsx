"use client";

import { Draggable } from "@hello-pangea/dnd";
import { TaskCard as ITask, BoardColumn } from "@/types";
import { tagColor } from "@/lib/tagColor";

interface Props {
  task: ITask;
  index: number;
  columns: BoardColumn[];
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
}

export default function TaskCard({ task, index, columns, onEdit, onDelete, onMove }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-2 transition
            ${snapshot.isDragging ? "shadow-xl rotate-1 scale-105 border-blue-400" : "hover:shadow-md"}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                {...provided.dragHandleProps}
                className="cursor-grab text-gray-400 flex-shrink-0"
              >
                ⠿
              </span>
              <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
            </div>

            <div className="flex gap-1 flex-shrink-0 ml-2">
              <button
                onClick={() => onEdit(task)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}

          {/* Footer */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>👤 {task.assignedTo || "—"}</span>
            <span>{new Date(task.createdAt).toLocaleDateString("pt-PT")}</span>
          </div>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Mover para coluna */}
          <select
            className="mt-1 text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-300"
            value={task.columnId}
            onChange={(e) => onMove(task.id, e.target.value)}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </Draggable>
  );
}