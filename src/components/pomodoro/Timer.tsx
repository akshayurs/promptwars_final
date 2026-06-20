import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Timer() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const { updateWellness, wellness } = useStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Reward user for completing a pomodoro (scaling reward by minutes could be fun!)
      const rewardPoints = Math.floor(selectedMinutes / 5);
      updateWellness({ mossLevel: wellness.mossLevel + 1, rockHealth: Math.min(100, wellness.rockHealth + rewardPoints) });
      alert(`Pomodoro complete! Pebbl grew some moss and gained ${rewardPoints} HP!`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedMinutes, updateWellness, wellness]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleSelectTime = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card variant="primary" className="text-center relative overflow-hidden h-full min-h-[300px] flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 font-bold text-xs rounded-bl-xl backdrop-blur-sm bg-opacity-80">
        POMODORO
      </div>
      
      {/* Time Selectors */}
      <div className="flex gap-2 mb-6 mt-4">
        {[15, 25, 45, 60].map((mins) => (
          <button
            key={mins}
            onClick={() => handleSelectTime(mins)}
            disabled={isActive}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-colors border ${
              selectedMinutes === mins 
                ? 'bg-foreground text-background border-foreground shadow-sm' 
                : 'bg-transparent text-foreground/70 border-foreground/20 hover:bg-foreground/5'
            } ${isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {mins}m
          </button>
        ))}
      </div>

      <div className="text-6xl md:text-7xl font-black font-mono mb-8 tracking-tighter drop-shadow-md">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button onClick={toggle} variant={isActive ? "secondary" : "default"} className="w-16 h-16 rounded-full flex items-center justify-center p-0 shadow-md">
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2" />}
        </Button>
        <Button onClick={reset} variant="default" className="w-16 h-16 rounded-full flex items-center justify-center p-0 bg-white/20 hover:bg-white/30 border border-black/10 dark:border-white/10 shadow-sm">
          <RotateCcw className="w-6 h-6 text-foreground" />
        </Button>
      </div>
    </Card>
  );
}
