import axios from 'axios';

// This is a placeholder API key; in a real app, you would use environment variables 
// or a secure storage mechanism for API keys
const API_KEY = 'YOUR_DEEPSEEK_API_KEY';

// Base URL for DeepSeek API
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

/**
 * AI Service for TIJA app using DeepSeek API
 */
const aiService = {
  // Initialize the service with configuration
  init: (apiKey) => {
    if (apiKey) {
      // Update API key if provided
      this.apiKey = apiKey;
    }
  },

  /**
   * Generate productivity insights based on user data
   * @param {Object} userData - User productivity data
   * @returns {Promise} - Promise with AI-generated insights
   */
  generateProductivityInsights: async (userData) => {
    try {
      // Extract relevant data for analysis
      const { tasks, focusSessions, completionRates } = userData;
      
      // Create prompt for the AI
      const prompt = `
        Analyze this user's productivity data and provide personalized insights and recommendations:
        
        Tasks:
        ${JSON.stringify(tasks)}
        
        Focus Sessions:
        ${JSON.stringify(focusSessions)}
        
        Completion Rates:
        ${JSON.stringify(completionRates)}
        
        Based on this data, please provide:
        1. An analysis of their current productivity patterns
        2. Three specific, actionable recommendations to improve productivity
        3. A suggestion for optimal work/break intervals
      `;
      
      // Make API request to DeepSeek
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/completions`, 
        {
          model: 'deepseek-coder',
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Extract the generated insights
      const insights = response.data.choices[0].text.trim();
      
      // Parse insights into structured format
      return {
        analysis: extractSection(insights, "analysis"),
        recommendations: extractRecommendations(insights),
        optimalIntervals: extractSection(insights, "optimal work/break intervals"),
        rawResponse: insights
      };
    } catch (error) {
      console.error('Error generating productivity insights:', error);
      throw error;
    }
  },
  
  /**
   * Optimize task schedule based on priorities and user patterns
   * @param {Array} tasks - List of tasks
   * @param {Object} userPatterns - User productivity patterns
   * @returns {Promise} - Promise with optimized task schedule
   */
  optimizeTaskSchedule: async (tasks, userPatterns) => {
    try {
      // Create prompt for the AI
      const prompt = `
        I need help optimizing this task schedule based on priorities and productivity patterns:
        
        Tasks:
        ${JSON.stringify(tasks)}
        
        User Productivity Patterns:
        ${JSON.stringify(userPatterns)}
        
        Please provide:
        1. An optimized schedule for these tasks
        2. Reasoning for the schedule
      `;
      
      // Make API request to DeepSeek
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/completions`, 
        {
          model: 'deepseek-coder',
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.3, // Lower temperature for more focused responses
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Extract the generated schedule
      const scheduleResponse = response.data.choices[0].text.trim();
      
      // Parse schedule into structured format
      return {
        schedule: extractSchedule(scheduleResponse),
        reasoning: extractSection(scheduleResponse, "reasoning"),
        rawResponse: scheduleResponse
      };
    } catch (error) {
      console.error('Error optimizing task schedule:', error);
      throw error;
    }
  },
  
  /**
   * Generate a personalized motivation message
   * @param {Object} userData - User data for context
   * @returns {Promise} - Promise with motivation message
   */
  generateMotivationMessage: async (userData) => {
    try {
      // Extract relevant data
      const { name, recentAchievements, currentChallenges } = userData;
      
      // Create prompt for the AI
      const prompt = `
        Write a short, personalized motivation message for ${name}.
        
        Recent achievements: ${JSON.stringify(recentAchievements)}
        Current challenges: ${JSON.stringify(currentChallenges)}
        
        The message should be positive, encouraging, and specific to their situation.
        Keep it under 100 words.
      `;
      
      // Make API request to DeepSeek
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/completions`, 
        {
          model: 'deepseek-coder',
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.8, // Higher temperature for more creative responses
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Extract the generated message
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating motivation message:', error);
      throw error;
    }
  },
  
  /**
   * Analyze work patterns to identify optimal focus times
   * @param {Array} focusSessions - History of user's focus sessions
   * @returns {Promise} - Promise with analyzed optimal times
   */
  analyzeOptimalFocusTimes: async (focusSessions) => {
    try {
      // Create prompt for the AI
      const prompt = `
        Analyze these focus session records to identify when the user is most productive:
        
        Focus Sessions:
        ${JSON.stringify(focusSessions)}
        
        Please provide:
        1. The optimal time of day for focused work
        2. Recommended session duration
        3. Pattern analysis
      `;
      
      // Make API request to DeepSeek
      const response = await axios.post(
        `${DEEPSEEK_API_URL}/completions`, 
        {
          model: 'deepseek-coder',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.4,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Extract the analysis
      const analysisResponse = response.data.choices[0].text.trim();
      
      // Parse analysis into structured format
      return {
        optimalTimeOfDay: extractSection(analysisResponse, "optimal time"),
        recommendedDuration: extractSection(analysisResponse, "recommended session duration"),
        patternAnalysis: extractSection(analysisResponse, "pattern analysis"),
        rawResponse: analysisResponse
      };
    } catch (error) {
      console.error('Error analyzing optimal focus times:', error);
      throw error;
    }
  }
};

// Helper functions for parsing AI responses

/**
 * Extract a section from the AI response based on a keyword
 */
function extractSection(text, keyword) {
  const pattern = new RegExp(`${keyword}[:\\s]+(.*?)(?:\\n\\n|$)`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

/**
 * Extract recommendations from the AI response
 */
function extractRecommendations(text) {
  const recommendations = [];
  const pattern = /\d+\.\s+(.*?)(?=\n\d+\.|$)/gs;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    recommendations.push(match[1].trim());
  }
  
  return recommendations;
}

/**
 * Extract schedule from the AI response
 */
function extractSchedule(text) {
  // This is a simplified version - in a real app, you would parse the schedule
  // into a structured format that works with your app's calendar/scheduling system
  const scheduleLines = text.split('\n').filter(line => 
    line.match(/^\d+[:.]\d+\s*[ap]m\s*-/i) || 
    line.match(/^morning:/i) || 
    line.match(/^afternoon:/i) || 
    line.match(/^evening:/i)
  );
  
  return scheduleLines.map(line => line.trim());
}

export default aiService;
