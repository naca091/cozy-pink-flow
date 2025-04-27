
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<{
    id: string;
    type: 'focus' | 'short_break' | 'long_break';
    duration: number;
  } | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const startSessionMutation = useMutation({
    mutationFn: async ({ type, duration }: { type: string; duration: number }) => {
      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no authenticated session, throw an error or handle accordingly
      if (!session?.user) {
        console.error("No authenticated user found");
        // For now, using a placeholder user ID for demo purposes
        // In a real app, you would want to handle this differently (e.g., prompt login)
        const demoUserId = '00000000-0000-0000-0000-000000000000';
        
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .insert({
            type,
            duration,
            user_id: demoUserId // Using the demo user ID
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
      // With authenticated user, proceed normally
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .insert({
          type,
          duration,
          user_id: session.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const completeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('pomodoro_sessions')
        .update({ completed: true, end_time: new Date().toISOString() })
        .eq('id', sessionId);
      
      if (error) throw error;
    }
  });

  const startTimer = useCallback((type: 'focus' | 'short_break' | 'long_break') => {
    let duration = 0;
    if (!settings) return;

    switch (type) {
      case 'focus':
        duration = settings.focus_duration;
        break;
      case 'short_break':
        duration = settings.short_break_duration;
        break;
      case 'long_break':
        duration = settings.long_break_duration;
        break;
    }

    startSessionMutation.mutate(
      { type, duration },
      {
        onSuccess: (data) => {
          setCurrentSession({ id: data.id, type, duration });
          setTimeLeft(duration);
          setIsRunning(true);
        }
      }
    );
  }, [settings, startSessionMutation]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (currentSession) {
      completeSessionMutation.mutate(currentSession.id);
    }
    setIsRunning(false);
    setCurrentSession(null);
    setTimeLeft(0);
  }, [currentSession, completeSessionMutation]);

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            stopTimer();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, stopTimer]);

  return {
    timeLeft,
    isRunning,
    currentSession,
    settings,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  };
};
