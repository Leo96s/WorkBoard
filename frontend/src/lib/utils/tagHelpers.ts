/**
 * Helper para gerenciar tags
 * Fornece funções para filtrar e manipular tags
 */

/**
 * Filtra tags sugeridas baseado no input
 */
export function filterSuggestedTags(
  globalTags: string[],
  tagInput: string,
  selectedTags: string[]
): string[] {
  return globalTags.filter(
    tag => !selectedTags.includes(tag) && tag.toLowerCase().includes(tagInput.toLowerCase())
  );
}

/**
 * Adiciona uma tag à lista
 */
export function addTag(
  tags: string[],
  newTag: string
): string[] {
  const trimmed = newTag.trim();
  if (!trimmed || tags.includes(trimmed)) return tags;
  return [...tags, trimmed];
}

/**
 * Remove uma tag da lista
 */
export function removeTag(tags: string[], tagToRemove: string): string[] {
  return tags.filter(t => t !== tagToRemove);
}
