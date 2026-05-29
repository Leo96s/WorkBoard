import { Droppable } from "@hello-pangea/dnd";
import { TaskCard as ITaskCard, BoardColumn } from "@/types";
import TaskCard from "./TaskCard";

interface Props {
  column: BoardColumn;
  tasks: ITaskCard[];
  columns: BoardColumn[]; // 👈 IMPORTANTE (vem do board atual)
  onEdit: (task: ITaskCard) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
  onAdd: () => void;
  onDeleteColumn: () => void;
}

export default function KanbanColumn({ column, tasks, columns, onEdit, onDelete, onMove, onAdd, onDeleteColumn }: Props) {
  
  const borderStyle = { borderTopColor: column.color };

  return (
    <div
      style={borderStyle}
      className="flex flex-col bg-gray-50 rounded-xl p-4 border-t-4 min-h-[500px] h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-bold text-gray-700">{column.name}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onAdd}
            title="Adicionar tarefa"
            className="text-lg text-gray-400 hover:text-blue-500 transition font-bold px-1"
          >
            +
          </button>
          {onDeleteColumn && (
            <button
              onClick={onDeleteColumn}
              title="Eliminar coluna"
              className="text-xs text-gray-300 hover:text-red-400 transition px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 flex-1 rounded-lg transition p-1
              ${snapshot.isDraggingOver ? "bg-blue-50 ring-2 ring-blue-200" : ""}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
