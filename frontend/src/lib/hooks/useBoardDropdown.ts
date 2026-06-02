import { useEffect, useRef, useState } from "react";

/**
 * Hook para gerir o estado do dropdown de boards
 * Responsável por abrir, fechar e detectar cliques fora
 */
export function useBoardDropdown() {
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Listener para fechar dropdown ao clicar fora
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBoardDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setBoardDropdownOpen(!boardDropdownOpen);
  const closeDropdown = () => setBoardDropdownOpen(false);

  return {
    boardDropdownOpen,
    setBoardDropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRef,
  };
}
