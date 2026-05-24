import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

export function useStudyPlan(userId) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchPlan();
  }, [userId]);

  const fetchPlan = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('study_plans').getByUserId(userId);
    if (error) console.error('fetchPlan error:', error);
    setPlan(Array.isArray(data) ? data[0] || null : data);
    setLoading(false);
  };

  const createPlan = async (planData) => {
    const { data, error } = await supabase.from('study_plans').insert({
      user_id: userId,
      ...planData,
    });
    if (error) {
      console.error('createPlan error:', error);
      return { data: null, error };
    }
    const created = Array.isArray(data) ? data[0] : data;
    setPlan(created);
    return { data: created, error: null };
  };

  const deletePlan = async () => {
    await supabase.from('study_plans').delete(userId);
    setPlan(null);
  };

  const markLessonComplete = async (lessonId) => {
    if (!plan) return;
    const current = plan.completed_lesson_ids || [];
    if (current.includes(lessonId)) return;
    const updated = [...current, lessonId];
    const { data } = await supabase.from('study_plans').update(plan.id, {
      completed_lesson_ids: updated,
    });
    if (data) setPlan(Array.isArray(data) ? data[0] : data);
  };

  const getLocalDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTodaysLessons = () => {
    if (!plan?.daily_schedule) return [];
    const today = getLocalDate();
    const schedule = typeof plan.daily_schedule === 'string'
      ? JSON.parse(plan.daily_schedule)
      : plan.daily_schedule;
    const todayEntry = schedule.find(d => d.date === today);
    return todayEntry?.lesson_ids || [];
  };

  const getDayNumber = () => {
    if (!plan?.start_date) return 1;
    const start = new Date(plan.start_date);
    const today = new Date();
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return Math.min(diff + 1, plan.target_days);
  };

  const getProgress = () => {
    if (!plan) return 0;
    const completed = (plan.completed_lesson_ids || []).length;
    const total = (plan.daily_schedule || []).reduce((sum, d) => sum + d.lesson_ids.length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return { plan, loading, createPlan, deletePlan, markLessonComplete, getTodaysLessons, getDayNumber, getProgress, refetch: fetchPlan };
}
