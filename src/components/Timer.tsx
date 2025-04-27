
import { useTimer } from '@/hooks/useTimer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Timer = () => {
  const { timeLeft, isRunning, currentSession, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
      
      <div className="flex gap-4">
        {!currentSession ? (
          <Button onClick={() => startTimer('focus')}>
            Start Focus
          </Button>
        ) : (
          <>
            {isRunning ? (
              <Button onClick={pauseTimer}>Pause</Button>
            ) : (
              <Button onClick={resumeTimer}>Resume</Button>
            )}
            <Button variant="destructive" onClick={stopTimer}>
              Stop
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => startTimer('short_break')}
          disabled={isRunning}
        >
          Short Break
        </Button>
        <Button
          variant="outline"
          onClick={() => startTimer('long_break')}
          disabled={isRunning}
        >
          Long Break
        </Button>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Completed Pomodoros: {completedPomodoros}
      </div>
    </div>
  );
};

export default Timer;
