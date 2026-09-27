const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_TIMEOUT_MS = 15000;

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error("Gemini request timed out.");
      err.code = "AI_TIMEOUT";
      reject(err);
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function callGeminiOnce(prompt) {
  try {
    return await withTimeout(
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      }),
      GEMINI_TIMEOUT_MS
    );
  } catch (error) {
    if (error.code === "AI_TIMEOUT") {
      throw error;
    }

    console.error("Gemini API error:", error);

    if (error.status === 429) {
      const apiError = new Error("Gemini rate limit exceeded.");
      apiError.code = "AI_RATE_LIMITED";
      throw apiError;
    }

    if (error.status === 503) {
      const apiError = new Error(
        "Gemini service temporarily unavailable."
      );
      apiError.code = "AI_REQUEST_FAILED";
      throw apiError;
    }

    const apiError = new Error("Gemini request failed.");
    apiError.code = "AI_REQUEST_FAILED";
    throw apiError;
  }
}

// Retry once, only for transient failures (timeout / 5xx-style failure).
// Never retry AI_RATE_LIMITED - retrying into a rate limit makes it worse.
async function callGeminiWithRetry(prompt) {
  try {
    return await callGeminiOnce(prompt);
  } catch (error) {
    if (error.code === "AI_TIMEOUT" || error.code === "AI_REQUEST_FAILED") {
      console.warn(`Retrying Gemini call after ${error.code}`);
      return await callGeminiOnce(prompt);
    }
    throw error;
  }
}

async function generateStudyContent(input, mode) {
  const prompt = `
You are a study assistant.

The user wants study material based on the following topic:

${input}

Mode: ${mode}

If mode is "quiz":
- Generate 5 to 10 multiple-choice questions.
- Every question must have exactly 4 options.
- correct_answer must be the zero-based index of the correct option.
- Include a short explanation for every answer.
- Do not repeat questions.
- Do not repeat answer options within a question.

If mode is "flashcards":
- Generate 5 to 10 flashcards.
- Each card must have a question and a concise answer.
- Do not repeat questions.

Return ONLY valid JSON.
Do not use Markdown.
Do not include code fences.
Do not include any text before or after the JSON.

Expected structure for quiz:
{
  "type": "quiz",
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correct_answer": 0,
      "explanation": "string"
    }
  ]
}

Expected structure for flashcards:
{
  "type": "flashcards",
  "title": "string",
  "cards": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
`;

  const response = await callGeminiWithRetry(prompt);

  let parsedResponse;

try {
  const cleanedText = response.text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  parsedResponse = JSON.parse(cleanedText);
} catch (error) {
  console.error("Gemini returned invalid JSON:", response.text);

  const parseError = new Error(
    "Gemini returned invalid JSON."
  );

  parseError.code = "INVALID_AI_RESPONSE";
  throw parseError;
}

return parsedResponse;
}

module.exports = {
  generateStudyContent,
};