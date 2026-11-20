import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

// All example sentences for the ordlista words, keyed by the Swedish word.
// Loaded once and reused by the printable word list.
async function loadExamples() {
  const map = {};
  let cursor;
  for (let page = 0; page < 10; page += 1) {
    const result = await base44.entities.WordExample.list({ sort: "sv", limit: 500, cursor });
    (result.items || []).forEach((record) => {
      map[record.sv] = record;
    });
    if (!result.has_more) break;
    cursor = result.next_cursor;
  }
  return map;
}

export function useWordExamples() {
  const { data: examples = {}, isLoading } = useQuery({
    queryKey: ["word-examples"],
    queryFn: loadExamples,
    staleTime: 1000 * 60 * 60,
  });

  return { examples, isLoading };
}