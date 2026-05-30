const express = require('express');
const router = express.Router();
const esprima = require('esprima');

router.post('/validate-code', (req, res) => {
    const { fixedCode, filePath } = req.body;

    if (!fixedCode) {
        return res.status(400).json({ error: "No code provided for validation." });
    }

    let score = 100;
    const issues = [];
    const isJavaScript = filePath.endsWith('.js') || filePath.endsWith('.jsx');

    if (fixedCode.includes('```')) {
        score -= 20;
        issues.push("AI leaked raw markdown block tick arrays (```) into file contents.");
    }

    if (fixedCode.trim().length < 10) {
        score -= 40;
        issues.push("Generated patch size is abnormally truncated or empty.");
    }

    const conversationalKeywords = ["here is the fix", "sure!", "i have updated", "hope this helps"];
    conversationalKeywords.forEach(word => {
        if (fixedCode.toLowerCase().includes(word)) {
            score -= 15;
            issues.push(`Conversational prompt language detected inside code stream: "${word}"`);
        }
    });
    if (isJavaScript) {
        try {
            esprima.parseModule(fixedCode);
        } catch (syntaxError) {
            score -= 50; 
            issues.push(`Compilation Blocked: Line ${syntaxError.lineNumber} - ${syntaxError.description}`);
        }
    } else {
        issues.push("Non-JS file format detected. Basic lexical parsing applied without AST compiler compilation checks.");
    }

    const finalScore = Math.max(0, score);
    
    let statusTier = "Excellent";
    if (finalScore < 90) statusTier = "Passed with Fixes";
    if (finalScore < 60) statusTier = "Failed Safety Threshold";

    res.json({
        score: finalScore,
        status: statusTier,
        issues: issues
    });
});

module.exports = router;