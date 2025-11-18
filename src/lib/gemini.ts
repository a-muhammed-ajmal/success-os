const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function generateAffirmation(focusTheme: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt =
    "You are a specialized personal success coach. Generate a single, powerful, " +
    "concise, and highly motivating daily affirmation (maximum 15 words) focused " +
    "on the user's requested theme. Use strong, assertive language.";

  const userQuery = `Generate my daily affirmation focusing on: ${focusTheme}.`;

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return text.trim().replace(/^['"]|['"]$/g, '');
    } else {
      throw new Error('Empty response from Gemini');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate affirmation');
  }
}
