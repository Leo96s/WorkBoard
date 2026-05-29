export type Column = 1 | 2 | 3;

export const COLUMN_LABELS: Record<Column, string> = {
  1: "A Fazer",
  2: "Em Curso",
  3: "Concluído"
};

export const COLUMN_COLORS: Record<Column, string> = {
  1: "border-red-400",
  2: "border-yellow-400",
  3: "border-green-400"
};

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  column: Column;
  assignedTo: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
}