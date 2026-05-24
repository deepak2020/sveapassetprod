const SUPABASE_URL = 'https://zpuaksuhvgwvnvopjaov.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdWFrc3Vodmd3dm52b3BqYW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTMzNjEsImV4cCI6MjA5NDc4OTM2MX0.9OxDkNgm8Lm93QHp_ZHlD3P5p6WOZRXECP_2ozPwXfU';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

export const supabase = {
  from: (table) => ({
    select: (cols = '*') => ({
      eq: (col, val) => ({
        order: (col2, { ascending = true } = {}) => ({
          limit: (n) => ({
            single: async () => {
              const res = await fetch(
                `${SUPABASE_URL}/rest/v1/${table}?select=${cols}&${col}=eq.${val}&order=${col2}.${ascending ? 'asc' : 'desc'}&limit=${n}`,
                { headers }
              );
              const data = await res.json();
              return { data: Array.isArray(data) ? data[0] || null : null, error: res.ok ? null : data };
            }
          })
        })
      })
    }),

    insert: (rows) => ({
      select: () => ({
        single: async () => {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(Array.isArray(rows) ? rows[0] : rows),
          });
          const data = await res.json();
          return { data: Array.isArray(data) ? data[0] || null : data, error: res.ok ? null : data };
        }
      })
    }),

    update: (fields) => ({
      eq: (col, val) => ({
        select: () => ({
          single: async () => {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(fields),
            });
            const data = await res.json();
            return { data: Array.isArray(data) ? data[0] || null : data, error: res.ok ? null : data };
          }
        })
      })
    }),

    delete: () => ({
      eq: async (col, val) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
          method: 'DELETE',
          headers,
        });
        return { error: res.ok ? null : await res.json() };
      }
    }),
  }),
};
