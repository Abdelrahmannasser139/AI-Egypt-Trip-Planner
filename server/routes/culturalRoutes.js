import express from 'express';
import { getCulturalInsights, answerCulturalQuestion, getCulturalTopics } from '../services/culturalService.js';

const router = express.Router();

/**
 * @route   GET /api/cultural/topics
 * @desc    Get a list of cultural topics about Egypt
 * @access  Public
 */
router.get('/topics', async (req, res) => {
  try {
    const topics = await getCulturalTopics();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching cultural topics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cultural topics',
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/cultural/insights/:topic
 * @desc    Get cultural insights about a specific topic
 * @access  Public
 */
router.get('/insights/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    const insights = await getCulturalInsights(topic);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching cultural insights:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cultural insights',
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/cultural/question
 * @desc    Answer a specific question about Egyptian culture
 * @access  Public
 */
router.post('/question', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const answer = await answerCulturalQuestion(question);
    res.json(answer);
  } catch (error) {
    console.error('Error answering cultural question:', error);
    res.status(500).json({ 
      error: 'Failed to answer cultural question',
      message: error.message 
    });
  }
});

export default router;
