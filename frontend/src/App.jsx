import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useGame } from './hooks/useGame';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { DisambiguationCard } from './components/DisambiguationCard';
import { ResultCard } from './components/ResultCard';
import { CorrectionCard } from './components/CorrectionCard';

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
    goBack,
    goToCorrection,
    resetGame,
    questionCount,
    recentGames,
    fetchRecentGames,
    submitFeedback,
    maxQuestions
  } = useGame();

  const containerRef = useRef(null);

  useEffect(() => {
    if (phase === 'start') {
      fetchRecentGames();
    }
  }, [phase]);

  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
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
        <StartScreen onStart={startGame} loading={loading} recentGames={recentGames} />
      )}

      {phase === 'question' && (
        <QuestionCard 
          question={question}
          confidence={confidence}
          remainingCandidates={remainingCandidates}
          loading={loading}
          onAnswer={submitAnswer}
          onBack={goBack}
          onHome={resetGame}
          questionCount={questionCount}
          maxQuestions={maxQuestions}
          banter={banter}
        />
      )}

      {phase === 'disambiguation' && (
        <DisambiguationCard 
          question={question}
          loading={loading}
          onAnswer={submitDisambiguation}
          onBack={goBack}
          onHome={resetGame}
          questionCount={questionCount}
          maxQuestions={maxQuestions}
        />
      )}

      {phase === 'result' && (
        <ResultCard 
          guess={guess}
          confidence={confidence}
          onRestart={resetGame}
          onBack={goBack}
          onWrong={goToCorrection}
          onSubmitFeedback={submitFeedback}
          banter={banter}
        />
      )}

      {phase === 'correction' && (
        <CorrectionCard 
          onRestart={resetGame}
          onSubmitFeedback={submitFeedback}
        />
      )}
    </div>
  );
}

export default App;
