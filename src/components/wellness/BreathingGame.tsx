'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Wind } from 'lucide-react';

export function BreathingGame() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const { updateWellness } = useStore();

  // Web Audio API Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain for smooth fade in/out
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; // Start silent
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create a deeply relaxing chord using low sine waves (e.g., C major / Solfeggio inspired)
      const frequencies = [174, 261.63, 329.63, 130.81]; 
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // LFO for slow volume modulation (makes the sound "breathe")
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (idx * 0.01); 
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.2; 
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        // Main oscillator
        osc.type = 'sine';
        osc.frequency.value = freq;
        oscGain.gain.value = 0.15; // Base volume per oscillator

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();
      });
    }
  };

  const startAudio = () => {
    initAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    // Smooth 2-second fade-in
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      gainNodeRef.current.gain.setTargetAtTime(1, audioCtxRef.current.currentTime, 2);
    }
  };

  const stopAudio = () => {
    // Smooth 3-second fade-out
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 1.5);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        // Transition phases: Inhale (4s) -> Hold (7s) -> Exhale (8s)
        if (phase === 'idle' || phase === 'exhale') {
          setPhase('inhale');
          setTimeLeft(4);
        } else if (phase === 'inhale') {
          setPhase('hold');
          setTimeLeft(7);
        } else if (phase === 'hold') {
          setPhase('exhale');
          setTimeLeft(8);
          // Award health after holding
          updateWellness({ rockHealth: 5, mossLevel: 0 });
        }
      }
    } else {
      setPhase('idle');
      setTimeLeft(0);
    }

    return () => clearTimeout(timer);
  }, [isActive, timeLeft, phase, updateWellness]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggle = () => {
    if (!isActive) {
      setIsActive(true);
      setPhase('inhale');
      setTimeLeft(4);
      startAudio();
    } else {
      setIsActive(false);
      stopAudio();
    }
  };

  // Animation variants
  const circleVariants = {
    idle: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    inhale: { scale: 1.8, backgroundColor: 'rgba(34, 211, 238, 0.4)', transition: { duration: 4, ease: "linear" } },
    hold: { scale: 1.8, backgroundColor: 'rgba(253, 224, 71, 0.4)', transition: { duration: 7, ease: "linear" } },
    exhale: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', transition: { duration: 8, ease: "linear" } }
  };

  const instructionText = {
    idle: "Ready to breathe?",
    inhale: "Inhale slowly...",
    hold: "Hold it...",
    exhale: "Exhale fully..."
  };

  const phaseMotivation = {
    idle: "",
    inhale: "Draw in calm and clarity...",
    hold: "Let your body absorb the stillness...",
    exhale: "Release all the tension and stress..."
  };

  return (
    <Card className="h-full flex flex-col items-center p-6 relative overflow-hidden min-h-[400px]">
      <div className="w-full flex justify-center z-20 mb-4">
        <div className="flex items-center gap-2 font-bold text-foreground/80 bg-foreground/5 dark:bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-foreground/10 shadow-sm">
          <Wind className="w-5 h-5" /> 4-7-8 Breathing
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <motion.div
          variants={circleVariants as unknown as import('framer-motion').Variants}
          animate={phase}
          className="absolute w-32 h-32 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center z-0"
        />
        <div className="z-10 text-center flex flex-col items-center w-full">
          <h2 className="text-3xl font-black mb-2 drop-shadow-md">
            {instructionText[phase]}
          </h2>
          {isActive ? (
            <>
              <p className="text-5xl font-mono font-bold text-foreground/80 my-4">{timeLeft}</p>
              <motion.p 
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-foreground/60 italic max-w-[250px] mx-auto text-center"
              >
                {phaseMotivation[phase]}
              </motion.p>
            </>
          ) : (
            <p className="text-sm font-medium text-foreground/60 italic max-w-[280px] mx-auto mt-2 mb-4 leading-relaxed">
              "Deep breathing lowers cortisol levels, slowing your heart rate and instantly neutralizing exam anxiety."
            </p>
          )}

          <div className="mt-6 z-10 w-full flex justify-center">
            <Button onClick={toggle} variant={isActive ? "secondary" : "accent"} className="px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
              {isActive ? "Stop" : "Start Exercise"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
