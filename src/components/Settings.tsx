
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Settings = () => {
  const { data: settings, refetch } = useQuery({
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

  const [formData, setFormData] = useState({
    focus_duration: settings?.focus_duration || 1500,
    short_break_duration: settings?.short_break_duration || 300,
    long_break_duration: settings?.long_break_duration || 900,
    long_break_interval: settings?.long_break_interval || 4,
    auto_start_breaks: settings?.auto_start_breaks || false,
    auto_start_pomodoro: settings?.auto_start_pomodoro || false,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: typeof formData) => {
      const { error } = await supabase
        .from('user_settings')
        .update(settings);
      
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="focus_duration">Focus Duration (minutes)</Label>
        <Input
          id="focus_duration"
          type="number"
          value={Math.floor(formData.focus_duration / 60)}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            focus_duration: parseInt(e.target.value) * 60
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_break_duration">Short Break Duration (minutes)</Label>
        <Input
          id="short_break_duration"
          type="number"
          value={Math.floor(formData.short_break_duration / 60)}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            short_break_duration: parseInt(e.target.value) * 60
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="long_break_duration">Long Break Duration (minutes)</Label>
        <Input
          id="long_break_duration"
          type="number"
          value={Math.floor(formData.long_break_duration / 60)}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            long_break_duration: parseInt(e.target.value) * 60
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="long_break_interval">Long Break Interval (pomodoros)</Label>
        <Input
          id="long_break_interval"
          type="number"
          value={formData.long_break_interval}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            long_break_interval: parseInt(e.target.value)
          }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="auto_start_breaks"
          checked={formData.auto_start_breaks}
          onCheckedChange={(checked) => setFormData(prev => ({
            ...prev,
            auto_start_breaks: checked === true
          }))}
        />
        <Label htmlFor="auto_start_breaks">Auto-start breaks</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="auto_start_pomodoro"
          checked={formData.auto_start_pomodoro}
          onCheckedChange={(checked) => setFormData(prev => ({
            ...prev,
            auto_start_pomodoro: checked === true
          }))}
        />
        <Label htmlFor="auto_start_pomodoro">Auto-start pomodoros</Label>
      </div>

      <Button type="submit" className="w-full">
        Save Settings
      </Button>
    </form>
  );
};

export default Settings;
