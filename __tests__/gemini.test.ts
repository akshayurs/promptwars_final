import { describe, it, expect, vi } from 'vitest';
import { getGeminiResponse, analyzeSentiment } from '../src/lib/gemini';

// Mock the @google/genai module
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: '{"rockHealthChange": 5, "mossLevelChange": 1, "analysis": "You are doing great!"}'
        })
      }
    }))
  };
});

describe('Gemini SDK Wrapper', () => {
  it('analyzes sentiment successfully and parses JSON', async () => {
    const result = await analyzeSentiment("I am feeling great today!");
    
    expect(result.rockHealthChange).toBe(5);
    expect(result.mossLevelChange).toBe(1);
    expect(result.analysis).toBe("You are doing great!");
  });
  
  it('handles chat responses', async () => {
    const result = await getGeminiResponse([{role: 'user', text: 'Hello'}]);
    expect(typeof result).toBe('string');
  });
});
