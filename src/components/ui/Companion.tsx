'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';

export function Companion() {
  const { wellness } = useStore();

  // Determine state based on HP ranges
  let imageSrc = '/pebbl_hp_3.png'; // Default
  let quote = "Take a deep breath. You're doing okay.";
  let glowGradient = "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)";

  if (wellness.rockHealth >= 81) {
    imageSrc = '/pebbl_hp_5.png';
    quote = "You're unstoppable! Keep this momentum going!";
    glowGradient = "radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, transparent 70%)";
  } else if (wellness.rockHealth >= 61) {
    imageSrc = '/pebbl_hp_4.png';
    quote = "You're doing great! Steady and strong.";
    glowGradient = "radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)";
  } else if (wellness.rockHealth >= 41) {
    imageSrc = '/pebbl_hp_3.png';
    quote = "Take a deep breath. You're doing okay.";
    glowGradient = "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)";
  } else if (wellness.rockHealth >= 21) {
    imageSrc = '/pebbl_hp_2.png';
    quote = "Things are getting tough. Time for a quick break.";
    glowGradient = "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)";
  } else {
    imageSrc = '/pebbl_hp_1.png';
    quote = "Burnout detected! Please step away and rest.";
    glowGradient = "radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, transparent 70%)";
  }

  return (
    <Card className="h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden min-h-[300px]">
      {/* Top HP Badge */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
        <div className="font-bold text-sm bg-black/10 dark:bg-white/10 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/5">
          HP: {wellness.rockHealth}/100
        </div>
      </div>
      
      {/* Perfectly Centered Pet */}
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          {/* Dynamic Gradient Behind Pet */}
          <div 
            className="absolute inset-[-40px] rounded-full transition-all duration-1000 z-0" 
            style={{ background: glowGradient }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageSrc} 
            alt="Pebbl" 
            className="w-full h-full object-cover rounded-3xl relative z-10 transition-all duration-500 hover:scale-105 border-4 border-white/10 dark:border-white/5" 
          />
        </div>
      </div>

      {/* Bottom Quote Text */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-10">
        <p className="font-bold text-foreground/80 text-sm max-w-[200px] italic leading-snug drop-shadow-sm">
          &quot;{quote}&quot;
        </p>
      </div>
    </Card>
  );
}
