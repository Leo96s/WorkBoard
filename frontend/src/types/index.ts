export interface Board {
  id: string;
  name: string;
  columns: BoardColumn[];
}
 
export interface BoardColumn {
  id: string;
  name: string;
  color: string;
  order: number;
  boardId: string;
}
 
export interface TaskCard {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  columnId: string;
  boardId: string;
  createdAt: string;
  tags: string[];
}
 
export interface CreateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
  boardId: string;
  columnId: string;
  tags: string[];
}
 
export interface UpdateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
  columnId?: string;
  tags: string[];
}
 
export interface CreateBoardDto {
  name: string;
}
 
export interface CreateColumnDto {
  name: string;
  color: string;
}
 
export interface UpdateColumnDto {
  name: string;
  color: string;
}
