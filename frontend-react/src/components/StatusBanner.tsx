import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import './StatusBanner.css';

interface StatusBannerProps {
  backendReady: boolean;
  loading: boolean;
  error: string | null;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ backendReady, loading, error }) => {
  if (loading && !backendReady) {
    return (
      <div className="status-banner loading">
        <FaSpinner className="icon-spin" />
        <span>Checking backend connection...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-banner error">
        <FaExclamationTriangle />
        <span>{error}</span>
      </div>
    );
  }

  if (backendReady) {
    return (
      <div className="status-banner success">
        <FaCheckCircle />
        <span>✅ Connected to backend</span>
      </div>
    );
  }

  return null;
};

export default StatusBanner;