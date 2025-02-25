import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const CHATBOT_PROMPT = `You are a concise programming assistant. Your responses should be:

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

Remember: Be concise but helpful. No fluff or unnecessary explanations.`;

export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `${CHATBOT_PROMPT}

Question: ${message}

Provide a clear, concise response. Include code only if directly relevant.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return "I couldn't process that. Could you try again?";
  }
}