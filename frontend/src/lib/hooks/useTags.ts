import { useState } from "react";

/**
 * Hook para gerenciar tags globais
 * Responsável por manter um registro de todas as tags usadas
 */
export function useTags() {
  const [globalTags, setGlobalTags] = useState<string[]>([]);

  /**
   * Mescla novas tags nas tags globais
   */
  const mergeGlobalTags = (newTags: string[]) => {
    setGlobalTags(prev => {
      const merged = [...prev];
      newTags.forEach(t => {
        if (!merged.includes(t)) merged.push(t);
      });
      return merged;
    });
  };

  return {
    globalTags,
    mergeGlobalTags,
  };
}
