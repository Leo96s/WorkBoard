/**
 * Gera uma cor aleatória para uma coluna
 * @returns {string} Cor em formato hexadecimal
 */
export function getRandomColor(): string {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
  return colors[Math.floor(Math.random() * colors.length)];
}
