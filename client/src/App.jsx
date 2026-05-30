import { useState } from 'react';
import { callPuterAI} from './utils/puterAi';
import axios from 'axios';
import RepoChat from './components/RepoChat';
import InputSection from './components/InputSection';
import FileList from './components/FileList';
import DiffDisplay from './components/DiffDisplay';
import PrAutomation from './components/PrAutomation'; //
import Auth from './components/Auth';
import GuardrailDisplay from './components/GuardrailDisplay';
import HistorySidebar from './components/HistorySidebar';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if(savedEmail && token && userId) {
      return {email: savedEmail, token, id: userId};
    }
    return null;
  });
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [issueData, setIssueData] = useState(null);
  const [status, setStatus] = useState('');
  const [isFreeMode, setIsFreeMode] = useState(true);
  const [selectedFileFix, setSelectedFileFix] = useState(null);
  const [guardrailReport, setGuardrailReport] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  }

  if(!user){
    return <Auth onLoginSuccess={(userData) => setUser({
      email: userData.email,
      token: userData.token,
      id: userData.id || userData.user?.id
    })} />
  }

  const handleFetchIssue = async () => {
    if (!url || (!isFreeMode && !apiKey)) return alert("Required Info missing");
    setLoading(true);
    setStatus('Fetching issue and identifying files...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/github/fetch-issue`, { url });
      const fetchedData = res.data;
      setIssueData(fetchedData);

      let targetedFiles;

      if (!isFreeMode) {
        setStatus('Using Gemini Cloud...');
        const aiRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/identify-files`, {
          issueTitle: fetchedData.title,
          issueBody: fetchedData.body,
          fileTree: fetchedData.fileTree,
          userApiKey: apiKey
        });
        targetedFiles = aiRes.data.targetedFiles;
      }
      else {
        setStatus('Using Puter AI (Free Mode)...');
        const prompt = `Identify top 3 file paths from this list for this issue: ${fetchedData.title}. 
        Return ONLY a JSON array of strings. 
        List: ${fetchedData.fileTree.slice(0, 500).join(', ')}`;
        
        const responseText = await callPuterAI(prompt);
        const start = responseText.indexOf('[');
        const end = responseText.lastIndexOf(']') + 1;
        targetedFiles = JSON.parse(responseText.substring(start, end));
      }

      setIssueData(prev => ({ ...prev, targetedFiles}));
      setStatus('Success! AI identified files.');
    } catch { setStatus('Error in analysis.'); }
    finally { setLoading(false); }
  };

  const handleGenerateFix = async (filePath) => {
    setLoading(true);
    setStatus(`Generating fix for ${filePath}...`);
    try {
      const contentRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/github/get-file-content`, {
        owner: issueData.owner,
        repo: issueData.repo,
        path: filePath
      });

      const originalCode = contentRes.data.content;
      let fixedCode;

      if (isFreeMode) {
          const prompt = `Fix this bug: ${issueData.title}. Description: ${issueData.body}. Code: ${originalCode}`;
          fixedCode = await callPuterAI(prompt);
          fixedCode = fixedCode.replace(/```[a-z]*|```/g, "").trim();
      }
      else {
          const aiRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/generate-fix`, {
              issueTitle: issueData.title,
              issueBody: issueData.body,
              fileContent: originalCode,
              filePath: filePath,
              userApiKey: apiKey
          });
          fixedCode = aiRes.data.fixedCode;
      }

      setStatus('Passing generated patch through quality checking guardrails...');
      const guardrailRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/guardrail/validate-code`, {
          fixedCode,
          filePath
      });
      setGuardrailReport(guardrailRes.data);

      setSelectedFileFix({
        fileName: filePath,
        original: originalCode,
        fixed: fixedCode
      });

      console.log("Saving history for User ID:", user?.id);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/history/save`, {
        userId: user.id, 
        issueTitle: issueData.title,
        repoName: `${issueData.owner}/${issueData.repo}`,
        filePath: filePath,
        originalCode: originalCode,
        fixedCode: fixedCode
      })

      setStatus('Fix ready! and saved to history.');
    } catch { setStatus('Failed to fix.'); }
    finally { setLoading(false); }
  };

  const handleSelectHistory = (historyItem) => {
    setIssueData({
      title: historyItem.issueTitle,
      owner: historyItem.repoName.split('/')[0],
      repo: historyItem.repoName.split('/')[1],
      body: "Loaded from history. Original issue description not saved.",
      targetedFiles: [historyItem.filePath]
    });

    setSelectedFileFix({
      fileName: historyItem.filePath,
      original: historyItem.originalCode,
      fixed: historyItem.fixedCode
    });

    setStatus(`Viewing saved fix from ${new Date(historyItem.createdAt).toLocaleDateString()}`);
  }

  return (
    <div className="App" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, background: '#0f172a' }}>
   
      <HistorySidebar userId={user.id} onSelectHistory={handleSelectHistory} />
      
      <div className="main-workspace" style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f172a' }}>
        
        <nav className="top-navbar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 30px', 
          background: '#1e293b', 
          borderBottom: '1px solid #334155',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Logged in as: <strong style={{ color: '#f8fafc' }}>{user.email}</strong>
          </span>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'transparent', 
              border: '1px solid #ef4444', 
              color: '#ef4444', 
              padding: '6px 14px', 
              fontSize: '0.85rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ef4444';
              e.target.style.color = '#white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#ef4444';
            }}
          >
            Logout
          </button>
        </nav>
        
        <div className="workspace-content" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          width: '100%', 
          margin: '0 auto', 
          padding: '30px 40px', 
          boxSizing: 'border-box' 
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="brand-title" style={{ marginTop: 0, marginBottom: '25px', fontSize: '2.2rem' }}>
              DevFlow <span style={{ color: '#3b82f6' }}>AI</span>
            </h1>
            
            <InputSection 
              apiKey={apiKey} setApiKey={setApiKey} 
              url={url} setUrl={setUrl} 
              handleFetchIssue={handleFetchIssue} loading={loading} 
              isFreeMode={isFreeMode} setIsFreeMode={setIsFreeMode}
            />

            {status && <p className="status-step" style={{ color: '#60a5fa', fontSize: '0.9rem', margin: '15px 0' }}>{status}</p>}
          </div>

          {issueData && (
            <div className="issue-card">
              <h3>{issueData.title}</h3>
              
              {issueData.targetedFiles && (
                <FileList 
                  files={issueData.targetedFiles} 
                  onGenerateFix={handleGenerateFix} 
                />
              )}

              <RepoChat fileTree={issueData.fileTree} issueTitle={issueData.title} />
              <DiffDisplay fixData={selectedFileFix} />
              <GuardrailDisplay report={guardrailReport} />
              <PrAutomation selectedFileFix={selectedFileFix} issueData={issueData} />
              
              <div className="description-box">
                <strong>Issue Description:</strong>
                <p>{issueData.body}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;