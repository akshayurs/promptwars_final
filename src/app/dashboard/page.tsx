'use client';

import React, { useState } from 'react';
import { VoiceChat } from '@/components/chat/VoiceChat';
import { Timer } from '@/components/pomodoro/Timer';
import { Companion } from '@/components/ui/Companion';
import { ExamNews } from '@/components/news/ExamNews';
import { BreathingGame } from '@/components/wellness/BreathingGame';
import { HealthChart } from '@/components/analytics/HealthChart';
import { Journal } from '@/components/wellness/Journal';
import { useStore } from '@/lib/store';
import { LogOut, Sun, Moon, MessageSquare, Clock, Wind, Radio, Activity, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useTheme } from 'next-themes';

export default function Dashboard() {
  const { profile, reset } = useStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'chat' | 'timer' | 'breathe' | 'news' | 'analytics' | 'journal'>('chat');

  const handleLogout = async () => {
    if (!profile?.isGuest) {
      await auth.signOut();
    }
    reset();
    router.push('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen app-gradient p-4 md:p-8 transition-colors duration-500 relative overflow-x-hidden flex flex-col">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Normal Static Navbar */}
      <nav className="w-full max-w-7xl mx-auto z-50 mb-8 relative shrink-0">
        <div className="glass-panel px-6 py-3 rounded-full flex justify-between items-center shadow-lg border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pebbl Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/20 bg-background" />
            <h1 className="text-xl md:text-2xl font-black tracking-tighter hidden sm:block">Pebbl.ai</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 rounded-full transition-colors border border-white/10"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-sm rounded-full transition-colors border border-red-500/20"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Bail Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-10">
        <div className="mb-6 pl-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">The Desk.</h1>
          <p className="text-foreground/70 font-medium mt-1">Sup, {profile.name}. Ready to lock in?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Sidebar: Fixed Companion */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 glass-panel p-2 flex flex-col">
              {/* Tab Navigation */}
              <div className="flex flex-col gap-2 p-2 mb-4">
                <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare />} label="Voice Yap" />
                <TabButton active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<BookOpen />} label="Daily Journal" />
                <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<Activity />} label="Progress" />
                <TabButton active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} icon={<Clock />} label="Pomodoro" />
                <TabButton active={activeTab === 'breathe'} onClick={() => setActiveTab('breathe')} icon={<Wind />} label="Breathe" />
                <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Radio />} label="Exam Radar" />
              </div>
              
              <div className="flex-1 min-h-[300px]">
                <Companion />
              </div>
            </div>
          </div>

          {/* Right Area: Dynamic Tab Content */}
          <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto">
            {activeTab === 'chat' && <VoiceChat />}
            {activeTab === 'journal' && <Journal />}
            {activeTab === 'analytics' && <HealthChart />}
            {activeTab === 'timer' && <Timer />}
            {activeTab === 'breathe' && <BreathingGame />}
            {activeTab === 'news' && <ExamNews />}
          </div>

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all w-full text-left ${
        active 
          ? 'bg-primary/20 text-primary-foreground border border-primary/30 shadow-sm' 
          : 'hover:bg-white/10 dark:hover:bg-black/10 text-foreground/70 border border-transparent'
      }`}
    >
      <span className={active ? 'text-primary dark:text-primary' : ''}>{icon}</span>
      {label}
    </button>
  );
}
