import { useState } from 'react';
import { startGameRequest, submitAnswerRequest, submitBackRequest, getRecentGamesRequest, submitFeedbackRequest } from '../api/client';

export const useGame = () => {
  const [sessionId, setSessionId] = useState(null);
  const [phase, setPhase] = useState('start'); // 'start', 'question', 'disambiguation', 'result'
  const [question, setQuestion] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [remainingCandidates, setRemainingCandidates] = useState(250);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState('');
  const [banter, setBanter] = useState('');
  const [maxQuestions, setMaxQuestions] = useState(8);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState('');
  const [recentGames, setRecentGames] = useState([]);

  const startGame = async (questions = 8) => {
    setMaxQuestions(questions);
    setLoading(true);
    setError('');
    setQuestionCount(0);
    setBanter('');
    try {
      const data = await startGameRequest(questions);
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

  const fetchRecentGames = async () => {
    try {
      const data = await getRecentGamesRequest();
      setRecentGames(data);
    } catch (err) {
      console.error('Failed to fetch recent games');
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
      if (data.banter === "Let's try that again...") {
        // We went back, questionCount should decrement in backend but here we handle it
        setQuestionCount(prev => Math.max(1, prev - 1));
      } else {
        setQuestionCount(prev => prev + 1);
      }
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

  const goToCorrection = () => {
    setPhase('correction');
  };

  const goBack = async () => {
    if (questionCount <= 1) return;
    setLoading(true);
    try {
      const data = await submitBackRequest(sessionId);
      processResponse(data);
    } catch (err) {
      setError('Failed to go back.');
    } finally {
      setLoading(false);
    }
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

  const submitFeedback = async (correctPlayer, wasCorrect) => {
    try {
      await submitFeedbackRequest(sessionId, correctPlayer, wasCorrect);
      fetchRecentGames(); // Refresh history
    } catch (err) {
      console.error('Failed to submit feedback');
    }
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
    recentGames,
    maxQuestions,
    startGame,
    submitAnswer,
    submitDisambiguation,
    goToCorrection,
    goBack,
    resetGame,
    fetchRecentGames,
    submitFeedback,
    maxQuestions,
  };
};
