import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const main = async () => {
    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
            role: "user",
            content: "Say hello!"
        }
    ];

    try {
        console.log("Sending request to Groq...");
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            max_completion_tokens: 1024,
            messages: messages,
        });

        console.log("\n=== RESPONSE ===");
        console.log(response.choices[0].message.content);
        console.log("================\n");

    } catch (error) {
        console.error("Error occurred:", error.message);
    }
};

main();