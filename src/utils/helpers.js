/**
 * Utility functions for the TIJA app
 */

// Format time from seconds to MM:SS
export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format date to readable format
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString(undefined, options);
  }
  
  return date.toLocaleDateString(undefined, options);
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Calculate task priority score
export const calculatePriorityScore = (task) => {
  if (!task) return 0;
  
  // Factors to consider:
  // 1. Due date proximity
  // 2. User-assigned priority (high, medium, low)
  // 3. Estimated completion time
  
  let score = 0;
  
  // Due date factor (higher score for closer due dates)
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysUntilDue = Math.max(0, Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)));
    
    // Increase priority as deadline approaches
    if (daysUntilDue <= 1) {
      score += 50; // Due today or tomorrow
    } else if (daysUntilDue <= 3) {
      score += 30; // Due within 3 days
    } else if (daysUntilDue <= 7) {
      score += 20; // Due within a week
    } else {
      score += 10; // Due later
    }
  }
  
  // Priority factor
  if (task.priority) {
    switch (task.priority.toLowerCase()) {
      case 'high':
        score += 30;
        break;
      case 'medium':
        score += 20;
        break;
      case 'low':
        score += 10;
        break;
      default:
        score += 15; // Default if priority not specified
    }
  }
  
  // Estimated time factor (prioritize quick wins)
  if (task.estimatedMinutes) {
    if (task.estimatedMinutes <= 15) {
      score += 15; // Quick task
    } else if (task.estimatedMinutes <= 30) {
      score += 10; // Medium task
    } else {
      score += 5; // Longer task
    }
  }
  
  return score;
};

// Sort tasks by priority
export const sortTasksByPriority = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  
  return [...tasks].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA; // Descending order (higher score first)
  });
};

// Group tasks by date
export const groupTasksByDate = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return {};
  
  const grouped = {};
  
  tasks.forEach(task => {
    if (!task.dueDate) {
      if (!grouped['No Date']) {
        grouped['No Date'] = [];
      }
      grouped['No Date'].push(task);
      return;
    }
    
    const dateKey = formatDate(task.dueDate);
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(task);
  });
  
  return grouped;
};

// Calculate productive time based on focus sessions
export const calculateProductiveTime = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) return 0;
  
  return sessions.reduce((total, session) => {
    if (session.completed && session.actual) {
      return total + session.actual;
    }
    return total;
  }, 0);
};

// Get most productive hour of the day based on focus sessions
export const getMostProductiveHour = (sessions) => {
  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) return null;
  
  // Count sessions by hour of day
  const hourCounts = {};
  const hourDurations = {};
  
  sessions.forEach(session => {
    if (session.startTime && session.completed) {
      const startTime = new Date(session.startTime);
      const hour = startTime.getHours();
      
      if (!hourCounts[hour]) {
        hourCounts[hour] = 0;
        hourDurations[hour] = 0;
      }
      
      hourCounts[hour]++;
      hourDurations[hour] += session.actual || 0;
    }
  });
  
  // Find hour with highest productivity (duration)
  let mostProductiveHour = null;
  let maxDuration = 0;
  
  Object.keys(hourDurations).forEach(hour => {
    if (hourDurations[hour] > maxDuration) {
      maxDuration = hourDurations[hour];
      mostProductiveHour = parseInt(hour, 10);
    }
  });
  
  return mostProductiveHour;
};

export default {
  formatTime,
  formatDate,
  generateId,
  calculatePriorityScore,
  sortTasksByPriority,
  groupTasksByDate,
  calculateProductiveTime,
  getMostProductiveHour,
};
