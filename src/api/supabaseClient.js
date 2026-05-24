const SUPABASE_URL = 'https://zpuaksuhvgwvnvopjaov.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdWFrc3Vodmd3dm52b3BqYW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTMzNjEsImV4cCI6MjA5NDc4OTM2MX0.9OxDkNgm8Lm93QHp_ZHlD3P5p6WOZRXECP_2ozPwXfU';

const BASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...BASE_HEADERS, ...options.headers },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    console.error('Supabase error:', data);
    return { data: null, error: data };
  }
  return { data, error: null };
}

export const supabase = {
  from: (table) => ({

    async getByUserId(userId) {
      return sbFetch(`${table}?user_id=eq.${userId}&order=created_at.desc&limit=1`);
    },

    async insert(row) {
      return sbFetch(`${table}`, {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(row),
      });
    },

    async update(id, fields) {
      return sbFetch(`${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(fields),
      });
    },

    async delete(userId) {
      return sbFetch(`${table}?user_id=eq.${userId}`, {
        method: 'DELETE',
      });
    },
  }),
};
