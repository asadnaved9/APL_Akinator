import React from 'react';
import { Mascot } from './Mascot';
import { RotateCcw, Trophy, Users, Clock } from 'lucide-react';

export const ResultCard = ({ guess, confidence, onRestart, banter }) => {
  // Mocking Akinator-style statistics for a professional feel
  const playedCount = Math.floor(Math.random() * 5000) + 1200;
  const lastPlayed = "2 hours ago";

  return (
    <div className="glass-card">
      <Mascot loading={false} confidence={1.0} />
      
      <div className="guess-reveal-label">I THINK OF...</div>
      <div className="guess-name">{guess}</div>
      
      {banter && (
        <div className="banter-box">
          <Trophy size={16} style={{ marginBottom: '8px', color: '#f59e0b' }} fill="#f59e0b" />
          <div>{banter}</div>
        </div>
      )}

      <div className="metrics-container" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Users size={14} /> Played {playedCount} times
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Clock size={14} /> {lastPlayed}
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <span>Prediction Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="metric-bar-bg">
            <div 
              className="metric-bar-fill confidence-fill" 
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <button className="action-btn btn-primary btn-full" onClick={onRestart}>
        <RotateCcw size={18} /> Play Again
      </button>
    </div>
  );
};
