import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface CodeAnalysis {
  suggestions: string[];
  patterns: string[];
  errors: string[];
  bestPractices: string[];
}

export async function analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `As an expert programming guru, analyze this ${language} code thoroughly:

${code}

Provide a detailed analysis in JSON format with the following structure:
{
  "errors": [
    // List of potential syntax or logic errors, each with a clear explanation
  ],
  "patterns": [
    // List of identified code patterns and their implications
  ],
  "suggestions": [
    // List of improvements for better code quality
  ],
  "bestPractices": [
    // List of relevant best practices and optimization tips
  ]
}

For each category:
1. Errors: Include line numbers and detailed explanations
2. Patterns: Identify common patterns and anti-patterns
3. Suggestions: Provide actionable improvements
4. Best Practices: Focus on language-specific conventions

If the code uses imported modules (like Python's math, numpy, etc.), explain how they're being used and any best practices related to them.

Keep explanations clear and beginner-friendly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const analysis = JSON.parse(text);
      return {
        suggestions: analysis.suggestions || [],
        patterns: analysis.patterns || [],
        errors: analysis.errors || [],
        bestPractices: analysis.bestPractices || []
      };
    } catch (e) {
      // If JSON parsing fails, format the text response into categories
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      return {
        suggestions: lines.filter(line => line.includes('suggest') || line.includes('improve')),
        patterns: lines.filter(line => line.includes('pattern')),
        errors: lines.filter(line => line.includes('error') || line.includes('bug')),
        bestPractices: lines.filter(line => line.includes('practice') || line.includes('convention'))
      };
    }
  } catch (error) {
    console.error('Error analyzing code:', error);
    return {
      suggestions: ['Error analyzing code. Please try again.'],
      patterns: [],
      errors: [],
      bestPractices: []
    };
  }
}