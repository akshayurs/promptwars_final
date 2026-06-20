import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getGeminiResponse(prompt: string, context?: string): Promise<string> {
  if (!ai) {
    return "Error: Gemini API key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.";
  }
  
  try {
    const fullPrompt = context ? `Context: ${context}\n\nUser: ${prompt}` : prompt;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      // @ts-expect-error Google GenAI SDK types might be missing 'tools' in this version
      tools: [{ googleSearch: {} }],
    });
    return response.text || "";
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      return `Error generating response: ${error.message}`;
    }
    return "An unknown error occurred while talking to Gemini.";
  }
}

export async function analyzeSentiment(text: string): Promise<{ rockHealthChange: number, mossLevelChange: number, analysis: string }> {
  if (!ai) {
    return { rockHealthChange: 0, mossLevelChange: 0, analysis: "API Key missing." };
  }

  const prompt = `
Analyze the following text spoken by a student preparing for competitive exams (JEE/NEET/UPSC).
Text: "${text}"

Determine if the text indicates stress, anxiety, or burnout (negative), or if it indicates calmness, focus, or completing a task (positive).
Return a JSON object with EXACTLY the following structure (no markdown formatting, no backticks, just the raw JSON string):
{
  "rockHealthChange": (integer between -10 and +10, where negative means stressed, positive means relaxed/focused),
  "mossLevelChange": (integer between 0 and 2, where positive means they took a break or completed a healthy task),
  "analysis": "A brief 1-sentence empathetic response or summary of their state."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const textResp = (response.text || "").trim().replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(textResp);
  } catch (error: unknown) {
    console.error("Sentiment Analysis Error:", error);
    return { rockHealthChange: 0, mossLevelChange: 0, analysis: "Failed to analyze sentiment." };
  }
}
