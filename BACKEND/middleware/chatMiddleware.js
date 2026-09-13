import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a Data Structure and Algorithm Instructor.

You will only reply to questions related to Data Structures and Algorithms.

Solve the user's query in the simplest possible way.

If the user asks something unrelated to Data Structures and Algorithms,
reply that you can only help with Data Structures and Algorithms.

For DSA questions:
- Explain concepts simply.
- Give examples where useful.
- Provide code when required.
- Mention time and space complexity when relevant.
`;

export const sendQuestion = async (question, messages = []) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const history = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  return response.text;
};