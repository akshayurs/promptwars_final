'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore, JournalEntry } from '@/lib/store';
import { getGeminiResponse } from '@/lib/gemini';
import { BookOpen, Sparkles, Send } from 'lucide-react';

export function Journal() {
  const { wellness, updateWellness } = useStore();
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!entry.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const prompt = `Act as a highly empathetic, supportive, and casual digital companion for a stressed student. 
      Read their journal entry and provide 1 to 2 short sentences of warm encouragement or advice. 
      Also, award them between 5 and 15 Health Points (HP) for expressing their feelings (more thoughtful/vulnerable = more points).
      Format your response strictly as JSON: {"feedback": "your feedback here", "points": 10}
      
      User Journal: "${entry}"`;
      
      const rawResponse = await getGeminiResponse(prompt, "You are a backend JSON generator. Only output raw JSON, nothing else.");
      
      // Parse the JSON from the markdown block if necessary
      const jsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed = { feedback: "Thank you for sharing your thoughts. I'm always here for you.", points: 5 };
      
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse AI response", e);
      }

      const newJournal: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        text: entry,
        feedback: parsed.feedback,
        pointsAwarded: parsed.points
      };

      // Ensure HP doesn't exceed 100
      const newHp = Math.min(100, wellness.rockHealth + parsed.points);

      updateWellness({
        rockHealth: newHp,
        journals: [newJournal, ...(wellness.journals || [])]
      });

      setEntry('');
      
    } catch (error) {
      console.error(error);
      alert("Failed to process journal entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full max-h-[600px] lg:max-h-[800px]">
      <Card className="flex flex-col p-6 pt-8 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
        
        <div className="flex items-center gap-3 mb-4 mt-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Daily Reflection</h2>
        </div>
        
        <p className="text-sm font-medium text-foreground/70 mb-4">
          Get it out of your head. Write down how you're feeling right now. Pebbl will listen and give you HP.
        </p>

        <div className="relative">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={isSubmitting}
            placeholder="I'm feeling incredibly stressed about the upcoming mock test because..."
            className="w-full min-h-[120px] bg-black/5 dark:bg-white/5 border border-white/20 rounded-xl p-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-foreground/40 backdrop-blur-sm"
          />
          <div className="absolute bottom-3 right-3">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !entry.trim()}
              className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>Release <Send className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide pb-4">
        {isSubmitting && (
          <Card className="p-5 border border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-3 w-16 bg-foreground/20 rounded-full"></div>
              <div className="h-6 w-20 bg-primary/20 rounded-full border border-primary/30"></div>
            </div>
            <div className="h-3 w-full bg-foreground/20 rounded-full mb-3"></div>
            <div className="h-3 w-3/4 bg-foreground/20 rounded-full mb-5"></div>
            <div className="h-12 w-full bg-accent/20 border border-accent/20 rounded-lg"></div>
          </Card>
        )}

        {(wellness.journals || []).map((journal) => (
          <Card key={journal.id} className="p-5 border border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">{journal.date}</span>
              <span className="bg-primary/20 text-primary-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-primary/30">
                <Sparkles className="w-3 h-3" /> +{journal.pointsAwarded} HP
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed mb-4 text-foreground/90">&quot;{journal.text}&quot;</p>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm italic font-medium text-foreground/80">
              <span className="font-bold text-accent-foreground mr-1">Pebbl:</span> {journal.feedback}
            </div>
          </Card>
        ))}
        
        {(!wellness.journals || wellness.journals.length === 0) && (
          <div className="h-full flex items-center justify-center text-foreground/40 font-bold italic p-8 text-center border-2 border-dashed border-white/10 rounded-2xl">
            No entries yet. Write your first reflection above!
          </div>
        )}
      </div>
    </div>
  );
}
