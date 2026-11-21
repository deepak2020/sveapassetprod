import { supabase } from "@/api/supabaseClient";
import { getListeningBank } from "@/data/listeningBankC";

// The listening bank lives in Supabase (listening_bank table); the static data
// file is the fallback when the table is empty or the fetch fails.
// The static categories give the structure (labels, order); DB items replace a
// category's pool when present. Shared by the listening page and the Provdag's
// Hörförståelse block so both read the same bank.
export async function loadListeningCategories(course) {
  const bank = getListeningBank(course);
  if (!bank) return null;

  const { data } = await supabase.listening.getItems(course?.toUpperCase());
  const dbItems = Array.isArray(data) ? data : [];

  return bank.map((cat) => {
    const fromDb = dbItems
      .filter((r) => r.type === cat.type)
      .map((r) => ({
        id: r.id,
        intro: r.intro,
        audioUrl: r.audio_url,
        transcript: r.transcript,
        questions: r.questions,
      }));
    // Database clips come first; static clips the table does not have yet
    // (for example newly generated audio) are added after them.
    if (fromDb.length === 0) return { ...cat, items: cat.items };
    const dbIds = new Set(fromDb.map((it) => it.id));
    return { ...cat, items: [...fromDb, ...cat.items.filter((it) => !dbIds.has(it.id))] };
  });
}