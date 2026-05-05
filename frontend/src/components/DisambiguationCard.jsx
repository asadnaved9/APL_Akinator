import React from 'react';
import mascotImg from '../assets/front_mascot.png';

export const DisambiguationCard = ({ question, loading, onAnswer, onBack }) => {
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
          <h2 className="mini-logo-text">akinator<span className="registered">®</span></h2>
          <div className="language-selector">
            English 🇬🇧
          </div>
        </div>
      </div>

      <div className="game-content-row">
        <div className="game-mascot-col">
          <img src={mascotImg} alt="Akinator" className="game-mascot-img" />
        </div>
        
        <div className="game-question-col">
          <div className="question-bubble-wrapper">
            <div className="question-number-tab" style={{ background: '#e74c3c' }}>
              <span className="diamond-bullet top-diamond">♦</span>
              <span className="q-num">!</span>
              <span className="diamond-bullet bottom-diamond">♦</span>
            </div>
            <div className="question-bubble-body">
              {loading ? "Analyzing..." : question}
            </div>
          </div>
          
          <div className="answer-options-box">
            <button className="answer-text-btn" onClick={() => onAnswer('yes')} disabled={loading}>Yes</button>
            <button className="answer-text-btn" onClick={() => onAnswer('no')} disabled={loading}>No</button>
            <div className="back-btn-separator"></div>
            <button className="answer-text-btn back-btn" onClick={onBack} disabled={loading}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};
