import { GoogleGenerativeAI } from "@google/generative-ai";
import { Itinerary } from "../types";

// Access API key from environment variables
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Log strictly for debugging (will show in terminal)
if (!API_KEY) {
    console.warn("=====================================================");
    console.warn(" WARN: EXPO_PUBLIC_GEMINI_API_KEY is missing/undefined.");
    console.warn(" Please check your .env file in the project root.");
    console.warn(" You MUST run 'npx expo start --clear' after editing .env");
    console.warn("=====================================================");
}

// Initialize Client
// We pass a dummy string if missing so the app doesn't crash on boot, but will fail on generation
const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

// CONFIGURATION: Using 'gemini-2.0-flash' as it is present in your supported models list
const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
    generationConfig: {
        responseMimeType: "application/json",
    },
});

const SYSTEM_INSTRUCTION = `
You are VibeMap, an AI concierge that generates city itineraries based on a "vibe".
You must return a JSON object strictly adhering to this schema:
{
  "itinerary_title": "string",
  "vibe_summary": "string",
  "stops": [
    {
      "id": "string",
      "name": "string",
      "coordinates": { "lat": number, "lng": number },
      "category": "string",
      "vibe_match_reason": "string",
      "estimated_cost": "string (e.g. $$, $$$)",
      "is_premium": boolean,
      "hidden_details": "string (optional, required if is_premium is true)"
    }
  ]
}
Generate 3-5 stops. Ensure coordinates are real and roughly in the same city (default to Bangalore, India unless specified).
Mark at least 1 stop as "is_premium": true, and provide a unique "hidden_details" tip for it.
`;

export const generateVibe = async (prompt: string): Promise<Itinerary> => {
    console.log(`Generating vibe for prompt using model gemini-2.0-flash: ${prompt}`);

    if (!API_KEY) {
        throw new Error("Missing API Key. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env and restart with --clear.");
    }

    try {
        const result = await model.generateContent([
            SYSTEM_INSTRUCTION,
            `User Prompt: ${prompt}`
        ]);

        const responseText = result.response.text();
        console.log("Gemini Response:", responseText);

        const itinerary: Itinerary = JSON.parse(responseText);
        return itinerary;

    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        // Provide more specific error messages based on common failures
        if (error.message?.includes("403") || error.message?.includes("API key")) {
            throw new Error("Invalid API Key. Please check your Google AI Studio key.");
        } else if (error.message?.includes("404")) {
            throw new Error("Model not found. Try updating the model name in gemini.ts.");
        }
        throw new Error("Failed to generate itinerary. Please try again.");
    }
};
