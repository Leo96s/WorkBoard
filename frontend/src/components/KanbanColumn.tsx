import { TaskCard as ITaskCard, Column, COLUMN_LABELS, COLUMN_COLORS } from "@/types";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  tasks: ITaskCard[];
  onEdit: (task: ITaskCard) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, column: Column) => void;
  onAdd: () => void;
}

export default function KanbanColumn({ column, tasks, onEdit, onDelete, onMove, onAdd }: Props) {
  return (
    <div className={`flex flex-col bg-gray-50 rounded-xl p-4 border-t-4 ${COLUMN_COLORS[column]} min-h-[500px] w-full`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-700">{COLUMN_LABELS[column]}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="text-lg text-gray-400 hover:text-blue-500 transition font-bold"
          title="Adicionar cartão"
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}