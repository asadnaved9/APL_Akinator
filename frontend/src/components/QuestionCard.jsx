import React from 'react';
import mascotImg from '../assets/front_mascot.png';
import downloadVideo from '../assets/untitled design.mp4';

export const QuestionCard = ({ 
  question, 
  confidence, 
  remainingCandidates, 
  loading, 
  onAnswer,
  onBack,
  questionCount,
  banter
}) => {
  return (
    <div className="game-screen-container">
      {/* Background decorations shared with start screen */}
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
            English
          </div>
        </div>
      </div>

      <div className="game-content-row">
        <div className="game-mascot-col" style={{ overflow: 'hidden', borderRadius: '50%', width: '350px', height: '350px', flexShrink: 0 }}>
          <video 
            src={downloadVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
        </div>
        
        <div className="game-question-col ">
          <div className="question-bubble-wrapper">
            <div className="question-number-tab">
              <span className="diamond-bullet top-diamond">♦</span>
              <span className="q-num">{questionCount || '1'}</span>
              <span className="diamond-bullet bottom-diamond">♦</span>
            </div>
            <div className="question-bubble-body">
              {loading ? "Consulting the crystal ball..." : question}
            </div>
          </div>
          
          <div className="answer-options-box">
            <button className="answer-text-btn" onClick={() => onAnswer('yes')} disabled={loading}>Yes</button>
            <button className="answer-text-btn" onClick={() => onAnswer('no')} disabled={loading}>No</button>
            <button className="answer-text-btn" onClick={() => onAnswer('dont_know')} disabled={loading}>Don't know</button>
            <button className="answer-text-btn" onClick={() => onAnswer('probably')} disabled={loading}>Probably</button>
            <button className="answer-text-btn" onClick={() => onAnswer('probably_not')} disabled={loading}>Probably not</button>
            <div className="back-btn-separator"></div>
            <button className="answer-text-btn back-btn" onClick={onBack} disabled={loading || questionCount <= 1}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};
