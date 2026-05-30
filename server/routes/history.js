const express = require('express');
const router = express.Router();
const Fix = require('../models/fix');

router.post('/save', async (req, res) => {
  try {
    const {userId, issueTitle, repoName, filePath, originalCode, fixedCode} = req.body;

    const newFix = new Fix({
      userId,
      issueTitle,
      repoName,
      filePath,
      originalCode,
      fixedCode
    })
    await newFix.save();
    res.status(201).json({message: "Fix saved to history."});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to save history"});
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const fixes = await Fix.find({userId: req.params.userId}).sort({createdAt: -1});
    res.json(fixes);
  }
  catch (err) {
    res.status(500).json({error: "Could not fetch history"});
  }
})

module.exports = router;