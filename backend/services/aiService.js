import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeCode = async (code, promptType = 'general') => {
  let systemPrompt = "You are a helpful senior software engineer assistant.";
  
  if (promptType === 'review') {
    systemPrompt = "You are an expert code reviewer. Analyze the provided code for bugs, security vulnerabilities, and logic errors. Provide a summary of issues and suggestions for improvement.";
  } else if (promptType === 'bug_fix') {
      systemPrompt = "You are an expert debugger. Analyze the provided code, identify the bug, and provide a corrected version of the code.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or gpt-4 if available/preferred
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the code snippet to analyze:\n\n${code}` },
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling AI service:', error);
    // Fallback for demo purposes if API key is missing/invalid
    return "⚠️ **AI Service Unavailable**\n\nReturning mock analysis:\n- Code looks mostly good.\n- Suggest adding more comments.\n- Verify error handling in async functions.";
  }
};
