import React from 'react';
import { Play } from 'lucide-react';

export const StartScreen = ({ onStart, loading }) => {
  return (
    <div className="glass-card">
      <div className="mascot-stage">
        <div className="mascot-glow"></div>
        <img src="/src/assets/mascot/neutral.svg" alt="AI Mascot" className="mascot-img" />
      </div>
      
      <h1>IPL AI AKINATOR</h1>
      <p className="subtitle">Think of any IPL player (past or present). I'll decipher your mind in 8 questions or less.</p>
      
      <button 
        className="action-btn btn-primary btn-full" 
        onClick={onStart}
        disabled={loading}
      >
        <Play size={20} fill="currentColor" /> {loading ? 'Initializing AI...' : 'Play Now'}
      </button>

      <div className="metrics-container" style={{ marginTop: '40px', opacity: 0.6 }}>
        <p style={{ fontSize: '0.8rem' }}>Powered by Gemini 1.5 Flash & Bayesian Inference</p>
      </div>
    </div>
  );
};
