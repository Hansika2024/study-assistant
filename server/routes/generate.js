const express = require("express");
const { generateStudyContent } = require("../services/gemini");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { input, mode } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Input is required.",
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

    const result = await generateStudyContent(input, mode);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Generate error:", error);

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong while generating study content.",
      },
    });
  }
});

module.exports = router;