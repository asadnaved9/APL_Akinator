import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const startGameRequest = async (maxQuestions = 8) => {
  const response = await api.post('/start', { max_questions: maxQuestions });
  return response.data;
};

export const getRecentGamesRequest = async () => {
  const response = await api.get('/recent');
  return response.data;
};

export const submitAnswerRequest = async (sessionId, answer) => {
  const response = await api.post('/answer', {
    session_id: sessionId,
    answer: answer,
  });
  return response.data;
};

export const submitBackRequest = async (sessionId) => {
  const response = await api.post('/back', {
    session_id: sessionId,
  });
  return response.data;
};
export const submitFeedbackRequest = async (sessionId, correctPlayer, wasCorrect) => {
  const response = await api.post('/feedback', {
    session_id: sessionId,
    correct_player: correctPlayer,
    was_correct: wasCorrect,
  });
  return response.data;
};
