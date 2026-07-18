/**
 * Limites de tamanho dos campos, espelhando as DataAnnotations do backend
 * (backend/DTOs/*.cs). Mantém o frontend e o backend consistentes.
 */
export const LIMITS = {
  boardName: 100,
  columnName: 50,
  taskTitle: 200,
  taskDescription: 2000,
  taskAssignedTo: 100,
  // O backend não impõe limite às tags; este valor é só uma restrição de UX
  // para evitar tags impraticavelmente longas na interface.
  tagName: 30,
} as const;
