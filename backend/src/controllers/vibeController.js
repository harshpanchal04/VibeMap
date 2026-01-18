const { GoogleGenerativeAI } = require("@google/generative-ai");
const Vibe = require('../models/Vibe');

// Initialize Gemini
// Note: Ensure GEMINI_API_KEY is in your backend .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
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

// @desc    Generate a new vibe itinerary
// @route   POST /api/vibes
// @access  Private
const generateVibe = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Please provide a prompt' });
    }

    try {
        const result = await model.generateContent([
            SYSTEM_INSTRUCTION,
            `User Prompt: ${prompt}`
        ]);

        const responseText = result.response.text();
        const itinerary = JSON.parse(responseText);

        // Save to Database
        const vibe = await Vibe.create({
            userId: req.user.id,
            prompt,
            itineraryJson: itinerary,
        });

        res.status(200).json(vibe);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        res.status(500).json({ message: 'Failed to generate itinerary' });
    }
};

// @desc    Get user's vibes
// @route   GET /api/vibes
// @access  Private
const getVibes = async (req, res) => {
    const vibes = await Vibe.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(vibes);
};

module.exports = {
    generateVibe,
    getVibes,
};
