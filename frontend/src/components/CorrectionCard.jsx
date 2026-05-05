import React, { useState } from 'react';
import mascotImg from '../assets/front_mascot.png';
import downloadVideo from '../assets/Untitled design.mp4';

export const CorrectionCard = ({ onRestart, onSubmitFeedback }) => {
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (correctAnswer.trim()) {
      if (onSubmitFeedback) {
        onSubmitFeedback(correctAnswer, false);
      }
      onRestart();
    }
  };

  return (
    <div className="game-screen-container">
      <div className="bg-decorations">
        <div className="diamond d1"></div>
        <div className="diamond d2"></div>
        <div className="diamond d3"></div>
        <div className="diamond d4"></div>
        <div className="diamond d5"></div>
      </div>

      <div className="game-header">
        <div className="mini-logo-container">
          <h2 className="mini-logo-text" onClick={onRestart} style={{ cursor: 'pointer' }}>
            akinator<span className="registered">®</span>
          </h2>
          <div className="header-actions">
            <button className="home-btn" onClick={onRestart} title="Go to Home">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>
            <div className="language-selector">English</div>
          </div>
        </div>
      </div>

      <div className="game-content-row">
        <div className="game-mascot-col">
          <div className="mascot-video-container">
            <video 
              src={downloadVideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="mascot-video"
            />
          </div>
        </div>
        
        <div className="game-question-col">
          <div className="question-bubble-wrapper">
            <div className="question-bubble-body">
              I'm sorry, I was wrong! Please tell me what you were thinking of...
            </div>
          </div>
          
          <div className="answer-options-box" style={{ padding: '20px 40px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter the correct answer..."
                style={{
                  padding: '12px 20px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1.1rem',
                  width: '100%'
                }}
                autoFocus
              />
              <button 
                type="submit" 
                className="result-btn btn-yes" 
                style={{ alignSelf: 'center', marginTop: '10px' }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
