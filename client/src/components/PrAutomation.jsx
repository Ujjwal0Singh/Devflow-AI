// client/src/components/PrAutomation.jsx
import { useState } from 'react';
import axios from 'axios';

const PrAutomation = ({ selectedFileFix, issueData }) => {
  const [githubToken, setGithubToken] = useState('');
  const [prStatus, setPrStatus] = useState('');
  const [prLink, setPrLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedFileFix || !issueData) return null;

  const handleDeployPr = async () => {
    if (!githubToken.trim()) return alert("Please enter your GitHub token first.");
    
    setIsSubmitting(true);
    setPrStatus('Initializing fork and PR creation sequence (takes a moment)...');
    setPrLink('');

    try {
      const res = await axios.post('http://localhost:5000/api/github-pr/create-pr', {
        githubToken: githubToken.trim(),
        owner: issueData.owner,
        repo: issueData.repo,
        filePath: selectedFileFix.fileName,
        fixedCode: selectedFileFix.fixed,
        issueTitle: issueData.title
      });
      setPrStatus('Success!');
      setPrLink(res.data.prUrl);
    } catch (error) {
      setPrStatus(`PR Deployment Failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pr-automation-panel" style={{
      marginTop: '25px',
      padding: '20px',
      background: '#1e293b',
      borderRadius: '12px',
      border: '1px solid #2563eb'
    }}>
      <h3 style={{ color: '#60a5fa', margin: '0 0 10px 0' }}>🚀 One-Click Code Contribution</h3>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 15px 0' }}>
        Submit an upstream Pull Request directly to the original repository using your personal GitHub credentials.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          type="password"
          placeholder="Paste your GitHub Personal Access Token (classic) with 'repo' scope..."
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          disabled={isSubmitting}
          style={{ margin: 0 }}
        />
        
        <button 
          onClick={handleDeployPr}
          disabled={isSubmitting}
          style={{ background: '#2563eb', alignSelf: 'flex-start' }}
        >
          {isSubmitting ? 'Deploying PR...' : 'Deploy Pull Request'}
        </button>

        {prStatus && <p style={{ fontSize: '13px', color: '#f59e0b', margin: '5px 0 0 0' }}>{prStatus}</p>}
        {prLink && (
          <div style={{ marginTop: '10px' }}>
            🎉 <a href={prLink} target="_blank" rel="noreferrer" style={{ color: '#34d399', fontWeight: 'bold', textDecoration: 'underline' }}>
              Click here to view your live Pull Request on GitHub!
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrAutomation;