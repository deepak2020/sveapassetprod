// Supabase REST client
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

  exerciseProgress: {
    async getForLesson(userId, lessonId) {
      const { data } = await sbFetch(
        `exercise_progress?user_id=eq.${userId}&lesson_id=eq.${encodeURIComponent(lessonId)}`
      );
      return Array.isArray(data) ? data : [];
    },

    async upsert(userId, lessonId, tab, currentIndex, score) {
      return sbFetch('exercise_progress', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: lessonId,
          tab,
          current_index: currentIndex,
          score,
          updated_at: new Date().toISOString(),
        }),
      });
    },

    async clear(userId, lessonId, tab) {
      return sbFetch(
        `exercise_progress?user_id=eq.${userId}&lesson_id=eq.${encodeURIComponent(lessonId)}&tab=eq.${tab}`,
        { method: 'DELETE' }
      );
    },
  },

  grammar: {
    async getTopics() {
      return sbFetch('grammar_topics?order=category_id,sort_order');
    },
    async getExercises(topicId) {
      return sbFetch(`grammar_exercises?topic_id=eq.${encodeURIComponent(topicId)}&order=sort_order`);
    },
    async getAllExercises() {
      return sbFetch('grammar_exercises?order=topic_id,sort_order');
    },
    async getExerciseCountByTopic() {
      return sbFetch('grammar_exercises?select=topic_id&order=topic_id');
    },
    async insertExercises(exercises) {
      return sbFetch('grammar_exercises', {
        method: 'POST',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify(exercises),
      });
    },
    async getProgressForUser(userId) {
      return sbFetch(`grammar_progress?user_id=eq.${encodeURIComponent(userId)}`);
    },
    async upsertProgress(userId, topicId, exercisesDone, exercisesTotal, score, completed) {
      return sbFetch('grammar_progress', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({
          user_id: userId,
          topic_id: topicId,
          exercises_done: exercisesDone,
          exercises_total: exercisesTotal,
          score,
          completed,
          last_seen_at: new Date().toISOString(),
        }),
      });
    },
  },

  feedback: {
    async insert(row) {
      return sbFetch('user_feedback', {
        method: 'POST',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify(row),
      });
    },

    async list() {
      return sbFetch('user_feedback?order=created_at.desc&limit=200');
    },
  },

  listening: {
    async getItems(course) {
      return sbFetch(`listening_bank?course=eq.${encodeURIComponent(course)}&order=type,sort_order`);
    },
    async getCourses() {
      return sbFetch('listening_bank?select=course');
    },
  },
};
