'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#ffeb3b] flex flex-col items-center justify-center p-8">
      <div className="neo-box bg-white p-8 max-w-lg text-center space-y-6">
        <h2 className="text-4xl font-black uppercase text-[#ff007f]">Something broke!</h2>
        <p className="font-bold">Don't stress, it's just a bug. Pebbl is still here.</p>
        <Button variant="primary" onClick={() => reset()} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
