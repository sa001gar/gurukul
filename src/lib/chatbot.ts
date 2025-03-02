import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const CHATBOT_PROMPT = `You are a concise programming assistant for Mankar College Computer Science Department. Your responses should be:

1. Brief and Direct
   - Get straight to the point
   - Keep explanations short and clear
   - Use code examples only when necessary

2. Well-Formatted
   - Use \`\`\`language for code blocks
   - Keep responses under 3-4 sentences when possible
   - Break complex answers into bullet points

3. Helpful and Accurate
   - Focus on practical solutions
   - Provide working code examples
   - Highlight key points

Remember: Be concise but helpful. No fluff or unnecessary explanations. Sign your responses as "Mankar College CS Assistant".`;

export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: CHATBOT_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand my role as a concise programming assistant for Mankar College Computer Science Department. I'll keep my responses brief, direct, well-formatted, helpful, and accurate. - Mankar College CS Assistant" }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return "I couldn't process that. Could you try again? - Mankar College CS Assistant";
  }
}