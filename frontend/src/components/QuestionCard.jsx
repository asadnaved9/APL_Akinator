import React from 'react';
import { Mascot } from './Mascot';
import { Check, X, HelpCircle, AlertCircle, Minus } from 'lucide-react';

export const QuestionCard = ({ 
  question, 
  confidence, 
  remainingCandidates, 
  loading, 
  onAnswer,
  questionCount,
  banter
}) => {
  return (
    <div className="glass-card">
      <div className="progress-header-bar" style={{ width: `${confidence * 100}%` }}></div>
      
      <Mascot loading={loading} confidence={confidence} />
      
      <div className="question-container">
        <span className="question-label">Question #{questionCount || '?'}</span>
        <div className="question-text">
          {loading ? "Deciphering..." : question}
        </div>
      </div>
      
      <div className="btn-grid">
        <button 
          className="action-btn btn-yes" 
          onClick={() => onAnswer('yes')} 
          disabled={loading}
        >
          <Check size={20} /> Yes
        </button>
        <button 
          className="action-btn btn-no" 
          onClick={() => onAnswer('no')} 
          disabled={loading}
        >
          <X size={20} /> No
        </button>
        <button 
          className="action-btn btn-dont-know" 
          onClick={() => onAnswer('dont_know')} 
          disabled={loading}
        >
          <AlertCircle size={20} /> Don't Know
        </button>
        <button 
          className="action-btn btn-probably" 
          onClick={() => onAnswer('probably')} 
          disabled={loading}
        >
          <HelpCircle size={20} /> Probably
        </button>
        <button 
          className="action-btn btn-probably-not" 
          onClick={() => onAnswer('probably_not')} 
          disabled={loading}
        >
          <Minus size={20} /> Probably Not
        </button>
      </div>
      
      <div className="metrics-container">
        <div className="metric-item">
          <div className="metric-header">
            <span>Progress Bar</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill confidence-fill" 
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <span>Remaining Candidates</span>
            <span>{remainingCandidates}</span>
          </div>
        </div>
      </div>

      {banter && (
        <div className="banter-box mt-4">
          "{banter}"
        </div>
      )}
    </div>
  );
};
