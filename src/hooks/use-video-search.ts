import { useGetMaterials } from "@/features/content/hooks/useGetMaterials";
import { useEffect, useMemo, useState } from "react";

export function useVideoSearch(search: string) {
  const [query, setQuery] = useState(search);
  const [debouncedQuery, setDebouncedQuery] = useState(search);

  const { data: materialsData, isLoading } = useGetMaterials({
    status: "DRAFT",
  });

  // 🔥 sync external search → internal state
  useEffect(() => {
    setQuery(search);
  }, [search]);

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 filtered data (memoized = performance boost)
  const data = useMemo(() => {
    const materials = materialsData?.data?.materials ?? [];
console.log(materialsData,"materialsData selecteddatadatadata",materials)
    if (!debouncedQuery) {
      return materials.slice(0, 20);
    }

    const q = debouncedQuery.toLowerCase();

    return materials
      .filter((item: any) =>
        item?.title?.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [materialsData, debouncedQuery]);

  return {
    data,
    loading: isLoading,
  };
}