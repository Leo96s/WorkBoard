import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { TaskCard as ITaskCard, BoardColumn } from "@/types";
import TaskCard from "./TaskCard";

interface Props {
  column: BoardColumn;
  tasks: ITaskCard[];
  columns: BoardColumn[];
  onEdit: (task: ITaskCard) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
  onAdd: () => void;
  onDeleteColumn: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

/**
 * Coluna Kanban - Apresentação pura
 * Exibe tarefas em uma coluna com suporte a drag and drop
 * Toda lógica é gerenciada pelo parent
 */
export default function KanbanColumn({
  column,
  tasks,
  columns,
  onEdit,
  onDelete,
  onMove,
  onAdd,
  onDeleteColumn,
  dragHandleProps,
}: Props) {
  const borderStyle = { borderTopColor: column.color };

  return (
    <div
      style={borderStyle}
      className="flex flex-col bg-gray-50 rounded-xl p-4 border-t-4 h-[600px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div
          {...dragHandleProps}
          className="flex items-center gap-2 cursor-grab select-none flex-1 min-w-0"
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-bold text-gray-700 truncate">{column.name}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            onClick={onAdd}
            title="Adicionar tarefa"
            className="text-lg text-gray-400 hover:text-blue-500 transition font-bold px-1"
          >
            +
          </button>
          <button
            onClick={onDeleteColumn}
            title="Eliminar coluna"
            className="text-xs text-gray-300 hover:text-red-400 transition px-1"
          >
            ✕
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 flex-1 overflow-y-auto rounded-lg transition p-1
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