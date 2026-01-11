// Cultural insights service for production
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all cultural topics
 * @returns {Promise} Promise object that resolves to an array of cultural topics
 */
export const fetchCulturalTopics = async () => {
  try {
    const response = await axios.get(`${API_URL}/cultural/topics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cultural topics:', error);

    // Fallback to mock data if API fails
    return await fallbackFetchCulturalTopics();
  }
};

/**
 * Fetch a specific cultural insight by topic
 * @param {string} topic - The topic to fetch insights for
 * @returns {Promise} Promise object that resolves to a cultural insight object
 */
export const fetchCulturalInsight = async (topic) => {
  try {
    const response = await axios.get(`${API_URL}/cultural/insights/${encodeURIComponent(topic)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cultural insight:', error);

    // Fallback to mock data if API fails
    return await fallbackFetchCulturalInsight(topic);
  }
};

/**
 * Ask a cultural question
 * @param {string} question - The question to ask
 * @returns {Promise} Promise object that resolves to an answer object
 */
export const answerCulturalQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/cultural/question`, { question });
    return response.data;
  } catch (error) {
    console.error('Error answering cultural question:', error);

    // Fallback to mock data if API fails
    return await fallbackAnswerCulturalQuestion(question);
  }
};

// Fallback functions that use mock data if the API fails

// Import mock data
import {
  mockCulturalTopics,
  mockCulturalInsights,
  fetchCulturalTopics as mockFetchCulturalTopics,
  fetchCulturalInsight as mockFetchCulturalInsight,
  answerCulturalQuestion as mockAnswerCulturalQuestion
} from './mock/mockCulturalService';

/**
 * Fallback function to fetch cultural topics from mock data
 */
const fallbackFetchCulturalTopics = async () => {
  console.warn('Falling back to mock cultural topics data');
  return await mockFetchCulturalTopics();
};

/**
 * Fallback function to fetch a cultural insight from mock data
 * @param {string} id - The ID of the cultural insight to fetch
 */
const fallbackFetchCulturalInsight = async (id) => {
  console.warn('Falling back to mock cultural insight data');
  return await mockFetchCulturalInsight(id);
};

/**
 * Fallback function to answer a cultural question using mock data
 * @param {string} question - The question to answer
 */
const fallbackAnswerCulturalQuestion = async (question) => {
  console.warn('Falling back to mock cultural question answering');
  return await mockAnswerCulturalQuestion(question);
};
