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

  const getSchedule = () => {
    if (!plan?.daily_schedule) return [];
    return typeof plan.daily_schedule === 'string'
      ? JSON.parse(plan.daily_schedule)
      : plan.daily_schedule;
  };

  // Intended daily pace = average lessons per scheduled day.
  const getPerDay = () => {
    const schedule = getSchedule();
    if (!schedule.length) return 3;
    const total = schedule.reduce((s, d) => s + (d.lesson_ids?.length || 0), 0);
    return Math.max(1, Math.ceil(total / schedule.length));
  };

  // Lessons scheduled on or before today that aren't done yet, oldest first.
  const getDueQueue = () => {
    const today = getLocalDate();
    const completed = plan?.completed_lesson_ids || [];
    return getSchedule()
      .filter(d => d.date <= today)
      .flatMap(d => d.lesson_ids || [])
      .filter(id => !completed.includes(id));
  };

  // Today's plan: the next `perDay` unfinished lessons from the due queue, so
  // missed days carry forward (capped so a long absence isn't overwhelming).
  // When fully caught up, offer the next upcoming lessons to study ahead.
  const getTodaysLessons = () => {
    const perDay = getPerDay();
    const due = getDueQueue();
    if (due.length) return due.slice(0, perDay);
    const today = getLocalDate();
    const completed = plan?.completed_lesson_ids || [];
    const upcoming = getSchedule()
      .filter(d => d.date > today)
      .flatMap(d => d.lesson_ids || [])
      .filter(id => !completed.includes(id));
    return upcoming.slice(0, perDay);
  };

  // How many lessons behind the intended pace (perDay × days elapsed).
  const getBehindCount = () => {
    const total = getSchedule().reduce((s, d) => s + (d.lesson_ids?.length || 0), 0);
    const doneCount = (plan?.completed_lesson_ids || []).length;
    const expected = getPerDay() * getDayNumber();
    return Math.max(0, Math.min(total - doneCount, expected - doneCount));
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

  return { plan, loading, createPlan, deletePlan, markLessonComplete, getTodaysLessons, getDayNumber, getProgress, getBehindCount, getDailyTarget: getPerDay, refetch: fetchPlan };
}
