'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const EXAMS = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'OTHER'];

export default function Onboarding() {
  const router = useRouter();
  const { profile, setProfile } = useStore();
  
  const [name, setName] = useState(profile?.name === 'Guest' ? '' : (profile?.name || ''));
  const [age, setAge] = useState(profile?.age === '18' ? '' : (profile?.age || ''));
  const [selectedExams, setSelectedExams] = useState<string[]>(profile?.targetExams || []);
  const [loading, setLoading] = useState(false);

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
    );
  };

  const handleComplete = async () => {
    if (!name.trim()) return alert('Please enter your name!');
    if (selectedExams.length === 0) return alert('Please select at least one exam!');
    
    setLoading(true);
    
    const newProfile = {
      ...profile,
      name,
      age,
      targetExams: selectedExams,
      isGuest: profile?.isGuest ?? false,
    } as { name: string; age: string; targetExams: string[]; isGuest: boolean; uid?: string };
    
    setProfile(newProfile);
    
    if (newProfile.uid && !newProfile.isGuest) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        // Timeout the save operation to prevent UI freeze if DB is offline
        const savePromise = setDoc(doc(db, 'users', newProfile.uid), newProfile, { merge: true });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
        
        await Promise.race([savePromise, timeoutPromise]);
      } catch (e) {
        console.warn("Firestore save skipped (likely offline/unconfigured). Profile saved locally.", e);
      }
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen app-gradient flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-500">
      <ParticleBackground />
      <ThemeToggle />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="p-8 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Build Your Profile</h1>
            <p className="text-lg font-medium text-foreground/70">Let's customize your survival kit.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/80">What do we call you?</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name or Nickname" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-foreground/80">Age (Optional)</label>
              <Input 
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 18" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-foreground/80">What are you preparing for?</label>
              <div className="flex flex-wrap gap-3">
                {EXAMS.map(exam => (
                  <button
                    key={exam}
                    onClick={() => toggleExam(exam)}
                    className={`px-5 py-2 font-bold rounded-full transition-all text-sm ${
                      selectedExams.includes(exam) 
                        ? 'bg-accent text-accent-foreground shadow-md scale-105' 
                        : 'bg-white/20 dark:bg-black/20 text-foreground/60 hover:bg-white/40 dark:hover:bg-black/40'
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 text-center">
            <Button 
              variant="secondary" 
              className="text-lg px-12 py-4 w-full shadow-xl shadow-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Let's Go 🚀"
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
