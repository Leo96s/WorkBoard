import axios from "axios";
import { CreateTaskDto, UpdateTaskDto } from "@/types";

const credentials = btoa(
  `${process.env.NEXT_PUBLIC_AUTH_USER}:${process.env.NEXT_PUBLIC_AUTH_PASS}`
);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json"
  }
});

export const taskApi = {
  getAll: () =>
    api.get("/api/Tasks"),

  filter: (filters: { column?: number; assignedTo?: string }) =>
    api.get("/api/Tasks/filter", { params: filters }),

  getById: (id: string) =>
    api.get(`/api/Tasks/${id}`),

  create: (data: CreateTaskDto) =>
    api.post("/api/Tasks", data),

  update: (id: string, data: UpdateTaskDto) =>
    api.put(`/api/Tasks/${id}`, data),

  move: (id: string, newColumn: number) =>
    api.patch(`/api/Tasks/${id}/move`, { newColumn }), // ← newColumn para bater com MoveTaskDto

  delete: (id: string) =>
    api.delete(`/api/Tasks/${id}`)
};