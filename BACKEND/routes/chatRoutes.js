import express from "express";
import { sendQuestion } from "../middleware/chatMiddleware.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question, messages = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await sendQuestion(question, messages);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get response from AI",
    });
  }
});

export default router;