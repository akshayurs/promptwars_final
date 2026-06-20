import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store';
import { getGeminiResponse, analyzeSentiment } from '@/lib/gemini';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    isFinal: boolean;
    length: number;
    [key: number]: { transcript: string };
  }[];
}

export function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [autoSubmitTrigger, setAutoSubmitTrigger] = useState(0);
  const { profile, wellness, updateWellness, chatHistory: messages, addChatMessage } = useStore();
  
  // Web Speech API Ref
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Initial welcome message delay
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setIsProcessing(true);
      setTimeout(() => {
        if (messages.length === 0) {
          addChatMessage({ role: 'ai', text: "Hey there! I'm Pebbl, your digital study buddy. How's the exam prep going so far?" });
        }
        setIsProcessing(false);
      }, 1200);
    }

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition?: new () => ISpeechRecognition, webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition || 
                              (window as Window & typeof globalThis & { webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: ISpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInputText(prev => prev + ' ' + finalTranscript);
            setIsVoiceMode(true);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setAutoSubmitTrigger(prev => prev + 1);
        };
      }
    }
  }, [addChatMessage, messages.length]);

  // Automatically submit the message when voice recording stops
  useEffect(() => {
    if (autoSubmitTrigger > 0 && isVoiceMode) {
      // Small delay to ensure state updates
      setTimeout(() => {
        const sendBtn = document.getElementById('chat-send-btn');
        if (sendBtn) sendBtn.click();
      }, 300);
    }
  }, [autoSubmitTrigger]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setInputText('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText.trim();
    setInputText('');
    addChatMessage({ role: 'user', text: userText });
    setIsProcessing(true);

    try {
      // 1. Analyze Sentiment
      const sentiment = await analyzeSentiment(userText);
      updateWellness({
        rockHealth: Math.min(100, Math.max(0, wellness.rockHealth + sentiment.rockHealthChange)),
        mossLevel: Math.max(0, wellness.mossLevel + sentiment.mossLevelChange)
      });

      // Prepare rich context
      let newsContext = "";
      try {
        const cachedNews = localStorage.getItem('pebbl_news_cache');
        if (cachedNews) {
          const parsed = JSON.parse(cachedNews);
          newsContext = "Recent News Headlines: " + parsed.data.map((n: { title: string }) => n.title).join(" | ");
        }
      } catch (err) {}

      const historyStr = messages.map(m => `${m.role === 'ai' ? 'Pebbl' : 'Student'}: ${m.text}`).join('\n');

      const context = `
Role: You are Pebbl, an empathetic digital pet rock and a highly supportive mentor for this student.
Tone: Respond in a warm, encouraging, mentor-like tone. Keep it extremely natural and concise. Do NOT use markdown asterisks or complex formatting.

CRITICAL INSTRUCTION:
Keep your answers EXTREMELY brief. For simple things, limit your response to 1-2 lines total.
If you need to say more, break your response into 2 short conversational messages separated by EXACTLY this string: |||
Example: Oh no, that sounds stressful! ||| Don't worry, we can get through this together.

User Context:
- Name: ${profile?.name || 'Student'}
- Preparing for: ${profile?.targetExams?.join(', ') || 'Exams'}
- Current Mental Health HP: ${wellness?.rockHealth || 100}/100. (If it's low, encourage them to take a break or do a breathing exercise).

${newsContext ? `Relevant Exam News (use ONLY if asked or naturally relevant):\n${newsContext}` : ''}

Conversation History up to now:
${historyStr}
`;

      const aiResponse = await getGeminiResponse(userText, context);
      
      // Ensure at least a 0.5s artificial gap before answering to simulate "thinking/typing"
      await new Promise(res => setTimeout(res, 500));

      // Split the response by our delimiter and filter out empty strings
      const splitMessages = aiResponse.split('|||').map(m => m.trim()).filter(m => m.length > 0);

      // Render each message sequentially with a slight delay to simulate typing
      for (let i = 0; i < splitMessages.length; i++) {
        const msgText = splitMessages[i];
        
        addChatMessage({ role: 'ai', text: msgText });

        // If user spoke the prompt, respond with voice
        if (isVoiceMode && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          // Strip emojis to prevent text-to-speech from reading emoji names
          const cleanText = msgText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.pitch = 1.1; // Slightly higher pitch for Pebbl
          window.speechSynthesis.speak(utterance);
        }

        // Wait before showing the next message to simulate typing speed (if not the last message)
        if (i < splitMessages.length - 1) {
          await new Promise(res => setTimeout(res, 1200));
        }
      }

    } catch (e) {
      console.error(e);
      addChatMessage({ role: 'ai', text: "*sad rock noises* I couldn't process that..." });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current && (messages.length > 0 || isProcessing)) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isProcessing]);

  return (
    <Card className="h-[600px] w-full relative overflow-hidden">
      {/* Premium Chat Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      <div className="flex flex-col h-full w-full relative z-10">
        <div ref={scrollContainerRef} aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-4 mb-2 relative z-10 scrollbar-hide">
          {messages.length === 0 && !isProcessing ? (
            <div className="flex h-full items-center justify-center text-foreground/40 font-medium">
              Start yapping to Pebbl...
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-md shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-primary/10 dark:bg-primary/20 text-foreground border border-primary/20 dark:border-primary/30 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 p-3 px-4 rounded-2xl rounded-tl-sm shadow-sm backdrop-blur-md flex items-center justify-center gap-1.5 h-[42px]">
                <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto p-2">
          <div className="flex gap-2 items-center glass-panel p-2 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(253,224,71,0.15)] relative z-20 bg-white/40 dark:bg-black/40 backdrop-blur-xl">
            <Button 
              variant={isRecording ? 'secondary' : 'default'}
              className="p-3 h-10 w-10 shrink-0 flex items-center justify-center rounded-full"
              onClick={toggleRecording}
              aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <input 
              type="text"
              className="flex-1 h-10 bg-transparent text-foreground placeholder:text-foreground/50 text-sm px-3 outline-none"
              placeholder="Message Pebbl..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsVoiceMode(false); // Manually typing disables voice response mode
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
              id="chat-send-btn"
              variant="primary"
              className="h-10 w-10 shrink-0 p-0 flex items-center justify-center rounded-full"
              onClick={handleSend}
              disabled={isProcessing || !inputText.trim()}
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
