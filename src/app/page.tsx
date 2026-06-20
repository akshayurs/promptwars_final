'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Brain, Zap, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export default function Home() {

  const router = useRouter();
  const { setProfile } = useStore();
  const { theme, setTheme } = useTheme();

  const handleGuestLogin = () => {
    setProfile({
      name: 'Guest',
      age: '18',
      targetExams: [],
      isGuest: true
    });
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen app-gradient flex flex-col overflow-hidden relative transition-colors duration-500">
      {/* High-Performance Canvas Particle Background */}
      <ParticleBackground />

      {/* Navbar */}
      <nav className="w-full z-50 px-4 md:px-8 pt-6 pb-2 relative shrink-0">
        <div className="max-w-7xl mx-auto glass-panel px-6 py-3 rounded-full flex justify-between items-center shadow-lg border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pebbl Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/20 bg-background" />
            <h1 className="text-xl md:text-2xl font-black tracking-tighter">Pebbl.ai</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 text-foreground border border-white/10"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full">
        {/* Soft Glow Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full text-center space-y-8 z-10"
        >
          <div className="inline-block glass-panel px-6 py-2 mb-4 font-semibold text-accent-foreground border-accent/50 text-sm tracking-widest uppercase">
            Competitive Exam Survival Kit
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight mb-6">
            Pebbl<span className="text-secondary">.ai</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-foreground/80">
            Stop stressing. Start yapping. Your AI digital pet rock for exam burnout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Button
              variant="primary"
              className="text-lg px-10 py-5 w-full sm:w-auto"
              onClick={handleGuestLogin}
            >
              Start Yapping (Guest)
            </Button>
            <Button
              variant="secondary"
              className="text-lg px-10 py-5 w-full sm:w-auto"
              onClick={() => router.push('/auth')}
            >
              Login / Sync
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            <Card className="flex flex-col items-center text-center">
              <Brain className="w-12 h-12 mb-4 text-secondary" />
              <h3 className="text-lg font-bold mb-2">Vent Your Stress</h3>
              <p className="text-sm text-foreground/70">Hold to talk. Yap about your mock tests and let the AI absorb your stress.</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <Clock className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-lg font-bold mb-2">Pomodoro Tracking</h3>
              <p className="text-sm text-foreground/70">Built-in study timer. Focus better, keep your rock healthy.</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <Zap className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Live Exam News</h3>
              <p className="text-sm text-foreground/70">Get instant updates on NEET, JEE, and UPSC directly in your dashboard.</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
