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
    const { data } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    setPlan(data || null);
    setLoading(false);
  };

  const createPlan = async (planData) => {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([{ user_id: userId, ...planData }])
      .select()
      .single();
    if (!error) setPlan(data);
    return { data, error };
  };

  const deletePlan = async () => {
    await supabase.from('study_plans').delete().eq('user_id', userId);
    setPlan(null);
  };

  const markLessonComplete = async (lessonId) => {
    if (!plan) return;
    const current = plan.completed_lesson_ids || [];
    if (current.includes(lessonId)) return;
    const updated = [...current, lessonId];
    const { data } = await supabase
      .from('study_plans')
      .update({ completed_lesson_ids: updated })
      .eq('id', plan.id)
      .select()
      .single();
    if (data) setPlan(data);
  };

  const getTodaysLessons = () => {
    if (!plan?.daily_schedule) return [];
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = plan.daily_schedule.find(d => d.date === today);
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
