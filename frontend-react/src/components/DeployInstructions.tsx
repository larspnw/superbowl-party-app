import React from 'react';
import { FaRocket, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './DeployInstructions.css';

interface DeployInstructionsProps {
  onRetry: () => void;
}

const DeployInstructions: React.FC<DeployInstructionsProps> = ({ onRetry }) => {
  return (
    <div className="deploy-instructions">
      <div className="deploy-header">
        <FaRocket className="deploy-icon" />
        <h3>🚀 Backend Not Deployed Yet</h3>
      </div>
      
      <p className="deploy-text">
        The frontend is ready, but the backend needs to be deployed to Render.
      </p>
      
      <div className="deploy-steps">
        <h4>Quick Deploy Steps:</h4>
        <ol>
          <li>
            Go to <a href="https://render.com" target="_blank" rel="noopener noreferrer">
              render.com <FaExternalLinkAlt className="external-link" />
            </a>
          </li>
          <li>Connect your GitHub repo: <code>larspnw/superbowl-party-app</code></li>
          <li>Create a new Web Service</li>
          <li>Use these settings:
            <ul className="settings-list">
              <li>Name: <code>superbowl-party-api</code></li>
              <li>Environment: Python</li>
              <li>Build Command: <code>pip install -r backend/requirements.txt</code></li>
              <li>Start Command: <code>python backend/app.py</code></li>
            </ul>
          </li>
          <li>Deploy and wait for it to show "Live"</li>
        </ol>
      </div>
      
      <div className="deploy-help">
        <p>
          <strong>Having issues?</strong> Check the{' '}
          <a href="https://github.com/larspnw/superbowl-party-app" target="_blank" rel="noopener noreferrer">
            GitHub repo <FaGithub className="github-icon" />
          </a>{' '}
          for troubleshooting tips.
        </p>
      </div>
      
      <button className="retry-btn" onClick={onRetry}>
        Check Again
      </button>
    </div>
  );
};

export default DeployInstructions;