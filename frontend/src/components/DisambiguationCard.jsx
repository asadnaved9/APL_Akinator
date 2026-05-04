import React from 'react';
import { Mascot } from './Mascot';

export const DisambiguationCard = ({ question, loading, onAnswer }) => {
  return (
    <div className="card disambiguation-card">
      <Mascot loading={loading} confidence={0.6} />
      
      <h3 className="warning-text">I'm torn between two players!</h3>
      
      <div className="question-text">
        {loading ? "Analyzing..." : question}
      </div>
      
      <div className="answer-buttons">
        <button 
          className="btn-yes" 
          onClick={() => onAnswer('yes')}
          disabled={loading}
        >
          Yes
        </button>
        <button 
          className="btn-no" 
          onClick={() => onAnswer('no')}
          disabled={loading}
        >
          No
        </button>
      </div>
    </div>
  );
};
