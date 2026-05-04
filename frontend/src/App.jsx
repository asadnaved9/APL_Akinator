import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useGame } from './hooks/useGame';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { DisambiguationCard } from './components/DisambiguationCard';
import { ResultCard } from './components/ResultCard';

import './styles.css';

function App() {
  const {
    phase,
    question,
    confidence,
    remainingCandidates,
    loading,
    guess,
    error,
    banter,
    startGame,
    submitAnswer,
    submitDisambiguation,
    resetGame,
    questionCount
  } = useGame();

  const containerRef = useRef(null);

  // Transition animation when phase changes
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: '.glass-card',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
      });
    }
  }, [phase]);

  return (
    <div className="app-container" ref={containerRef}>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {phase === 'start' && (
        <StartScreen onStart={startGame} loading={loading} />
      )}

      {phase === 'question' && (
        <QuestionCard 
          question={question}
          confidence={confidence}
          remainingCandidates={remainingCandidates}
          loading={loading}
          onAnswer={submitAnswer}
          questionCount={questionCount}
          banter={banter}
        />
      )}

      {phase === 'disambiguation' && (
        <DisambiguationCard 
          question={question}
          loading={loading}
          onAnswer={submitDisambiguation}
        />
      )}

      {phase === 'result' && (
        <ResultCard 
          guess={guess}
          confidence={confidence}
          onRestart={resetGame}
          banter={banter}
        />
      )}
    </div>
  );
}

export default App;
