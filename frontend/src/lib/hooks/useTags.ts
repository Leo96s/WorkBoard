import { useCallback, useState } from "react";

/**
 * Hook para gerir tags globais
 * Responsável por manter um registro de todas as tags usadas
 */
export function useTags() {
  const [globalTags, setGlobalTags] = useState<string[]>([]);

  /**
   * Mescla novas tags nas tags globais.
   * Identidade estável (useCallback) e sem criar array novo quando nada muda,
   * para poder ser usado em segurança como dependência de useEffect sem risco de loop.
   */
  const mergeGlobalTags = useCallback((newTags: string[]) => {
    setGlobalTags(prev => {
      const toAdd = newTags.filter(t => !prev.includes(t));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, []);

  return {
    globalTags,
    mergeGlobalTags,
  };
}
