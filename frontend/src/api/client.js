import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const startGameRequest = async () => {
  const response = await api.post('/start');
  return response.data;
};

export const submitAnswerRequest = async (sessionId, answer) => {
  const response = await api.post('/answer', {
    session_id: sessionId,
    answer: answer,
  });
  return response.data;
};
