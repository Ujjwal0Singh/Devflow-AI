const express = require('express');
const router = express.Router();
const {GoogleGenerativeAI} = require('@google/generative-ai');

router.post('/identify-files', async (req, res) => {
  const {issueTitle, issueBody, fileTree, userApiKey} = req.body;

  try {
    const genAI = new GoogleGenerativeAI(userApiKey);
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});
    
    const prompt = `
            Act as a JSON generator. Identify the TOP 3 files most likely involved in this issue.
            
            ISSUE: ${issueTitle} - ${issueBody}
            FILES: ${fileTree.slice(0, 500).join('\n')} 

            IMPORTANT: You must return a RAW JSON ARRAY of strings only. 
            No explanations, no markdown, no conversational text.
            Example format: ["path/to/file1.js", "path/to/file2.js"]
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    let targetedFiles;
    try {
        // Find the first '[' and last ']' to extract just the array
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']') + 1;
        const jsonOnly = text.substring(start, end);
        targetedFiles = JSON.parse(jsonOnly);
    } catch (parseErr) {
        console.error("AI Response was not clean JSON:", text);
        // Fallback: If AI fails to give an array, return an empty one or a helpful error
        return res.status(500).json({ error: "AI response format was invalid. Please try again." });
    }
        //
    res.json({targetedFiles});
  }
  catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI failed to identify files." });
  }
});

router.post('/generate-fix', async (req, res) => {
  const {issueTitle, issueBody, fileContent, filePath, userApiKey} = req.body;
  try {
    const genAI = new GoogleGenerativeAI(userApiKey);
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

    const prompt = `
            You are a Senior Software Engineer and also an expert compiler agent. Analyze the provided file and fix 
            the bug described in the issue context..You must return the completely updated, runnable source code file enclosed strictly within markdown triple backticks (````). Do not include any conversational text, theory, explanations, or file names outside of these backticks.
            
            ISSUE: ${issueTitle}
            DESCRIPTION: ${issueBody}
            FILE PATH: ${filePath}

            CURRENT CODE:
            \`\`\`
            ${fileContent}
            \`\`\`

            INSTRUCTION: 
            Return ONLY the completely updated, runnable source code file. 
            Do NOT include markdown blocks, backticks(``), or explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fixedCode = response.text().replace(/```[a-z]*|```/g, "").trim();

    res.json({fixedCode});
  }
  catch (error){
    console.error("Fix Generation Error:", error);
    res.status(500).json({ error: "AI failed to generate a fix." });
  }
});

module.exports = router
