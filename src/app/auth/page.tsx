'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AuthPage() {
  const router = useRouter();
  const { setProfile } = useStore();
  const [loading, setLoading] = useState(false);

  // ... (login code) ...

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        
        // Timeout the Firestore request after 2 seconds so it doesn't hang the UI
        // if the database is offline or unconfigured.
        const fetchDocPromise = getDoc(userRef);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Firestore timeout")), 2000)
        );

        const userSnap = await Promise.race([fetchDocPromise, timeoutPromise]) as import('firebase/firestore').DocumentSnapshot;

        if (userSnap && userSnap.exists && userSnap.exists()) {
          const data = userSnap.data();
          setProfile({
            name: data.name || user.displayName || 'User',
            age: data.age || '',
            targetExams: data.targetExams || [],
            uid: user.uid,
            isGuest: false
          });
          router.push('/dashboard');
          return;
        }
      } catch (dbError) {
        // Silently proceed to onboarding if Firestore is offline
      }

      // If they don't exist in Firestore OR if Firestore isn't fully set up yet:
      setProfile({
        name: user.displayName || 'User',
        age: '',
        targetExams: [],
        uid: user.uid,
        isGuest: false
      });
      router.push('/onboarding');
      
    } catch (error) {
      // Login failed, handled gracefully
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-gradient flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-500">
      <ThemeToggle />
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 md:p-12 text-center space-y-8 backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Login</h1>
            <p className="text-lg font-medium text-foreground/70">Sync your pet rock across devices.</p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="default"
              className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-foreground/50 font-medium">Or</span>
              </div>
            </div>

            <Button 
              variant="secondary"
              className="w-full shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => router.push('/onboarding')}
              disabled={loading}
            >
              Continue as Guest
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
