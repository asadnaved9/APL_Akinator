import React from 'react';
import mascotImg from '../assets/front_mascot.png';

export const ResultCard = ({ guess, confidence, onRestart, onBack, onWrong, banter }) => {
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
          <div className="result-top-box">
            <div className="result-header">I THINK OF</div>
            <div className="result-body">
              <h3 className="guess-name-text">{guess}</h3>
              <p className="guess-subtitle">{banter || 'Guessed by Akinator'}</p>
              
              <div className="result-actions">
                <button className="result-btn btn-yes" onClick={onRestart}>Yes</button>
                <div className="result-diamond">♦</div>
                <button className="result-btn btn-no" onClick={onBack}>No</button>
              </div>
            </div>
          </div>
          
          <div className="result-image-box">
            <div className="placeholder-image">
              <img src="https://via.placeholder.com/300x200.png?text=Character+Image" alt="Character" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
            <button className="result-back-link" onClick={onBack} style={{ margin: 0, zIndex: 10, cursor: 'pointer', padding: '10px 20px', border: '1px solid #5d7c99', borderRadius: '20px' }}>
              &larr; Go back
            </button>
            <button className="result-back-link" onClick={onWrong} style={{ margin: 0, zIndex: 10, cursor: 'pointer', padding: '10px 20px', border: '1px solid #5d7c99', borderRadius: '20px' }}>
              I was wrong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
