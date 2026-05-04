import { useState } from 'react';
import { startGameRequest, submitAnswerRequest } from '../api/client';

export const useGame = () => {
  const [sessionId, setSessionId] = useState(null);
  const [phase, setPhase] = useState('start'); // 'start', 'question', 'disambiguation', 'result'
  const [question, setQuestion] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [remainingCandidates, setRemainingCandidates] = useState(250);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState('');
  const [banter, setBanter] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState('');

  const startGame = async () => {
    setLoading(true);
    setError('');
    setQuestionCount(0);
    setBanter('');
    try {
      const data = await startGameRequest();
      setSessionId(data.session_id);
      setQuestion(data.question);
      setConfidence(data.confidence || 0);
      setRemainingCandidates(data.remaining_candidates);
      setQuestionCount(1);
      setPhase('question');
    } catch (err) {
      setError('Failed to start the game. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const processResponse = (data) => {
    setConfidence(data.confidence || 0);
    if (data.remaining_candidates !== undefined) {
      setRemainingCandidates(data.remaining_candidates);
    }
    
    if (data.banter) {
      setBanter(data.banter);
    }

    if (data.guess) {
      setGuess(data.guess);
      setPhase('result');
    } else if (data.is_disambiguation) {
      setQuestion(data.question);
      setPhase('disambiguation');
    } else {
      setQuestion(data.question);
      setQuestionCount(prev => prev + 1);
      setPhase('question');
    }
  };

  const submitAnswer = async (answer) => {
    setLoading(true);
    setError('');
    try {
      const data = await submitAnswerRequest(sessionId, answer);
      processResponse(data);
    } catch (err) {
      setError('Failed to submit answer.');
    } finally {
      setLoading(false);
    }
  };

  const submitDisambiguation = async (answer) => {
    submitAnswer(answer);
  };

  const resetGame = () => {
    setSessionId(null);
    setPhase('start');
    setQuestion('');
    setConfidence(0);
    setRemainingCandidates(250);
    setGuess('');
    setBanter('');
    setQuestionCount(0);
    setError('');
  };

  return {
    sessionId,
    phase,
    question,
    confidence,
    remainingCandidates,
    loading,
    guess,
    banter,
    questionCount,
    error,
    startGame,
    submitAnswer,
    submitDisambiguation,
    resetGame,
  };
};
