import axios from "axios";
import { CreateTaskDto, UpdateTaskDto, CreateBoardDto, CreateColumnDto, UpdateColumnDto } from "@/types";
 
const credentials = btoa(
  `${process.env.NEXT_PUBLIC_AUTH_USER}:${process.env.NEXT_PUBLIC_AUTH_PASS}`
);
 
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
});
 
export const taskApi = {
  getAll: () =>
    api.get("/api/Tasks"),
 
  filter: (filters: { boardId?: string; columnId?: string; assignedTo?: string }) =>
    api.get("/api/Tasks/filter", { params: filters }),
 
  // Shorthand: filter tasks by board (used on board load)
  filterByBoard: (boardId: string, assignedTo?: string) =>
    api.get("/api/Tasks/filter", { params: { boardId, assignedTo } }),
 
  getById: (id: string) =>
    api.get(`/api/Tasks/${id}`),
 
  create: (data: CreateTaskDto) =>
    api.post("/api/Tasks", data),
 
  update: (id: string, data: UpdateTaskDto) =>
    api.put(`/api/Tasks/${id}`, data),
 
  // Fixed: payload is { newColumnId } not { newColumn }
  move: (id: string, newColumnId: string) =>
    api.patch(`/api/Tasks/${id}/move`, { newColumnId }),
 
  delete: (id: string) =>
    api.delete(`/api/Tasks/${id}`),
};
 
export const boardApi = {
  getAll: () =>
    api.get("/api/boards"),
 
  getById: (id: string) =>
    api.get(`/api/boards/${id}`),
 
  create: (data: CreateBoardDto) =>
    api.post("/api/boards", data),
 
  delete: (id: string) =>
    api.delete(`/api/boards/${id}`),
};
 
export const columnApi = {
  // Columns are nested under boards: POST /api/boards/{boardId}/columns
  create: (boardId: string, data: CreateColumnDto) =>
    api.post(`/api/boards/${boardId}/columns`, data),
 
  update: (boardId: string, columnId: string, data: UpdateColumnDto) =>
    api.put(`/api/boards/${boardId}/columns/${columnId}`, data),
 
  delete: (boardId: string, columnId: string) =>
    api.delete(`/api/boards/${boardId}/columns/${columnId}`),
};
