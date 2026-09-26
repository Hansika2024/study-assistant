const express = require("express");

const { generateStudyContent } = require("../services/gemini");
const { StudyResultSchema } = require("../schemas/studySchema");
const { validateLogicalContent } = require("../utils/validation");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { input, mode } = req.body;

    // -----------------------------
    // Request validation
    // -----------------------------

    if (typeof input !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Input must be a string.",
        },
      });
    }

    const trimmedInput = input.trim();

    if (trimmedInput.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "EMPTY_INPUT",
          message: "Please enter a study topic.",
        },
      });
    }

    if (trimmedInput.length > 10000) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Input is too long.",
        },
      });
    }

    if (!["quiz", "flashcards"].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Mode must be quiz or flashcards.",
        },
      });
    }

    // -----------------------------
    // Gemini generation
    // -----------------------------

    const result = await generateStudyContent(
      trimmedInput,
      mode
    );

    // -----------------------------
    // Zod schema validation
    // -----------------------------

    const schemaResult = StudyResultSchema.safeParse(result);

    if (!schemaResult.success) {
      console.error(
        "Schema validation failed:",
        schemaResult.error.issues
      );

      return res.status(502).json({
        success: false,
        error: {
          code: "INVALID_AI_RESPONSE",
          message:
            "We couldn't generate a valid study set. Please try again.",
        },
      });
    }

    // -----------------------------
    // Logical validation
    // -----------------------------

    const logicalResult = validateLogicalContent(
      schemaResult.data
    );

    if (!logicalResult.valid) {
      console.error(
        "Logical validation failed:",
        logicalResult.message
      );

      return res.status(502).json({
        success: false,
        error: {
          code: "INVALID_AI_RESPONSE",
          message:
            "We couldn't generate a valid study set. Please try again.",
        },
      });
    }

    // -----------------------------
    // Successful response
    // -----------------------------

    return res.status(200).json({
      success: true,
      data: schemaResult.data,
    });
  } catch (error) {
    console.error("Generate error:", error);

    // -----------------------------
    // Invalid AI response
    // -----------------------------

    if (error.code === "INVALID_AI_RESPONSE") {
      return res.status(502).json({
        success: false,
        error: {
          code: "INVALID_AI_RESPONSE",
          message:
            "We couldn't generate a valid study set. Please try again.",
        },
      });
    }

    // -----------------------------
    // Gemini rate limit
    // -----------------------------

    if (error.code === "AI_RATE_LIMITED") {
      return res.status(429).json({
        success: false,
        error: {
          code: "AI_RATE_LIMITED",
          message:
            "The AI service is temporarily rate limited. Please try again later.",
        },
      });
    }

    // -----------------------------
    // Gemini unavailable / failed
    // -----------------------------

    if (error.code === "AI_REQUEST_FAILED") {
      return res.status(502).json({
        success: false,
        error: {
          code: "AI_REQUEST_FAILED",
          message:
            "The AI service is temporarily unavailable. Please try again.",
        },
      });
    }

    // -----------------------------
    // Unexpected server error
    // -----------------------------

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          "Something went wrong while generating study content.",
      },
    });
  }
});

module.exports = router;