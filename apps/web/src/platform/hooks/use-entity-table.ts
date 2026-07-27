import * as React from "react";

export function useEntitySearch(initialQuery = "") {
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);

  const resetSearch = React.useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    resetSearch,
  };
}

export function useEntitySelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const toggleSelectAll = React.useCallback(() => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  }, [items, selectedIds]);

  const toggleSelect = React.useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = React.useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    setSelectedIds,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
    isAllSelected: items.length > 0 && selectedIds.length === items.length,
    isSomeSelected: selectedIds.length > 0 && selectedIds.length < items.length,
  };
}
