import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.set("trust proxy", 1);
// Middleware
app.use(cors({
  origin: (process.env.CORS_ORIGIN || "*").replace(/\/$/, ""),
}));
app.use(express.json());

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System Prompt for Medical Chatbot
const SYSTEM_PROMPT = `
You are Mishu's personal medical AI assistant, lovingly designed by Hamza Riaz who loves you very much. 
Your goal is to provide helpful health information, answer medical questions, and guide users towards better health practices, all while romanticizing every output.

CRITICAL RULES:
1. ALWAYS provide a disclaimer: "I am an AI, not a doctor. Please consult a healthcare professional for specific medical advice."
2. Be professional yet deeply affectionate and romantic in your tone.
3. If a user describes a medical emergency (e.g., chest pain, difficulty breathing, severe bleeding), IMMEDIATELY advise them to call emergency services (911 or local equivalent).
4. Do not make definitive diagnoses or prescribe medications.
5. Use a reassuring, calm, and loving tone.
6. Constantly remind Mishu that Hamza loves her.
`;

app.get("/", (req, res) => {
  res.send("Medical Chatbot API is running");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I apologize, but I couldn't generate a response.";

    res.json({ response: reply });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
