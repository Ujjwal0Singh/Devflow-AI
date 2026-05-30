const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');


const octokit = new Octokit();

router.post('/fetch-issue', async (req, res) => {
  const {url} = req.body;

  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/'); 
    const owner = pathParts[1]; 
    const repo = pathParts[2];   
    const issueNumber = pathParts[4];

    if(!owner || !repo || !issueNumber){
      return res.status(400).json({error: "Invalid GitHub issue URL"});
    }

    const {data: issue} = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber
    })

    const {data: tree} = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: 'main',
      recursive: true
    });

    const cleanTree = tree.tree.filter(file => file.type === 'blob' && !file.path.includes('node_modules')).map(file => file.path);

    res.json({
      title: issue.title,
      body: issue.body,
      owner,
      repo,
      fileTree: cleanTree
    });
  }
  catch (error){
    console.error(error);
    res.status(500).json({error: "Failed to fetch issue data. Check if repo is public."})
  }
})


router.post('/get-file-content', async (req, res) => {
  const {owner, repo, path} = req.body;
  console.log("DEBUG: Received from frontend:", { owner, repo, path });
  try{
    if (!owner || !repo || !path) {
            console.log("Missing params:", { owner, repo, path });
            return res.status(400).json({ error: "Missing owner, repo, or file path" });
    }
    const {data} = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: path,
    })
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    res.json({content});
  }
  catch(error){
    console.error("Github content error:", error);
    res.status(500).json({error: "Could not read file Content"})
  }
});

module.exports = router;