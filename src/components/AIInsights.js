import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Surface, Card, Button, Chip, List, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import aiService from '../services/aiService';

const AIInsights = ({ onClose, style }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const tasks = useSelector(state => state.tasks.tasks);
  const focusSessions = useSelector(state => state.focus.sessions);
  const user = useSelector(state => state.user);
  
  // Calculate completion rates
  const calculateCompletionRates = () => {
    if (!tasks || tasks.length === 0) return {};
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Group by categories if available
    const categoryRates = {};
    const tasksByCategory = {};
    
    tasks.forEach(task => {
      if (task.categories && task.categories.length > 0) {
        task.categories.forEach(category => {
          if (!tasksByCategory[category]) {
            tasksByCategory[category] = { total: 0, completed: 0 };
          }
          
          tasksByCategory[category].total += 1;
          if (task.completed) {
            tasksByCategory[category].completed += 1;
          }
        });
      }
    });
    
    // Calculate rates by category
    Object.keys(tasksByCategory).forEach(category => {
      const { total, completed } = tasksByCategory[category];
      categoryRates[category] = (completed / total) * 100;
    });
    
    return {
      overall: completionRate.toFixed(2),
      byCategory: categoryRates
    };
  };
  
  // Generate insights when component mounts
  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        
        // Prepare data for AI analysis
        const userData = {
          tasks,
          focusSessions,
          completionRates: calculateCompletionRates(),
          name: user?.user?.displayName || 'User',
          recentAchievements: [
            'Completed 5 tasks yesterday',
            'Finished a major project',
            'Maintained focus for 2 hours straight'
          ],
          currentChallenges: [
            'Has 3 high-priority tasks due soon',
            'Struggling with consistent focus times',
            'Often works late into the evening'
          ]
        };
        
        // Get insights from AI service
        const productivityInsights = await aiService.generateProductivityInsights(userData);
        
        // Get optimal focus times
        const focusTimeAnalysis = await aiService.analyzeOptimalFocusTimes(focusSessions);
        
        // Get motivation message
        const motivationMessage = await aiService.generateMotivationMessage(userData);
        
        // Combine all insights
        const combinedInsights = {
          ...productivityInsights,
          optimalFocusTimes: focusTimeAnalysis,
          motivationMessage
        };
        
        setInsights(combinedInsights);
        setLoading(false);
      } catch (err) {
        console.error('Error generating AI insights:', err);
        setError('Failed to generate insights. Please try again later.');
        setLoading(false);
        
        // Use fallback insights for development/demo
        setInsights(getFallbackInsights());
      }
    };
    
    generateInsights();
  }, []);
  
  // Fallback insights for when API fails or for development/demo
  const getFallbackInsights = () => {
    return {
      analysis: "You're most productive in the morning between 9-11 AM. You tend to complete tasks more efficiently when you work in focused sprints. Your completion rate is higher for work-related tasks compared to personal tasks.",
      recommendations: [
        "Schedule your most important tasks during your peak productivity time (9-11 AM).",
        "Use 25-minute focused work periods followed by 5-minute breaks to maintain concentration.",
        "Break down larger tasks into smaller, more manageable subtasks to improve completion rates."
      ],
      optimalIntervals: "Based on your patterns, 25-minute work periods with 5-minute breaks work best for you. Consider a longer 15-minute break after every 4 work periods.",
      optimalFocusTimes: {
        optimalTimeOfDay: "9:00 AM - 11:30 AM",
        recommendedDuration: "25 minutes",
        patternAnalysis: "You tend to be most focused and effective in the morning hours. Your productivity declines after lunch but picks up again in the late afternoon."
      },
      motivationMessage: "Great job completing that major project! With 3 high-priority tasks on your plate, remember how effectively you've handled challenges before. Try applying your morning focus powers to tackle the most important task first. You've got this!"
    };
  };
  
  if (loading) {
    return (
      <Surface style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Analyzing your productivity patterns...</Text>
        </View>
      </Surface>
    );
  }
  
  if (error) {
    return (
      <Surface style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={onClose} style={styles.button}>
            Close
          </Button>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, style]}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Your AI Productivity Coach</Text>
        
        {insights?.motivationMessage && (
          <Card style={styles.motivationCard}>
            <Card.Content>
              <Text style={styles.motivationText}>{insights.motivationMessage}</Text>
            </Card.Content>
          </Card>
        )}
        
        <Text style={styles.sectionTitle}>Productivity Analysis</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text>{insights?.analysis}</Text>
          </Card.Content>
        </Card>
        
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Card style={styles.card}>
          <Card.Content>
            {insights?.recommendations?.map((recommendation, index) => (
              <List.Item
                key={index}
                title={recommendation}
                left={props => <List.Icon {...props} icon="lightbulb-outline" />}
                titleNumberOfLines={3}
              />
            ))}
          </Card.Content>
        </Card>
        
        <Text style={styles.sectionTitle}>Optimal Work Patterns</Text>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.chipContainer}>
              <Chip 
                icon="clock-outline" 
                style={styles.chip}
              >
                Best time: {insights?.optimalFocusTimes?.optimalTimeOfDay}
              </Chip>
              <Chip 
                icon="timer-outline" 
                style={styles.chip}
              >
                Session: {insights?.optimalFocusTimes?.recommendedDuration}
              </Chip>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.patternTitle}>Your Pattern Analysis:</Text>
            <Text>{insights?.optimalFocusTimes?.patternAnalysis}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Button 
          mode="outlined" 
          onPress={onClose}
          style={styles.button}
        >
          Close
        </Button>
        <Button 
          mode="contained" 
          onPress={() => {
            // Apply recommendations - this would be implemented in a real app
            onClose();
          }}
          style={styles.button}
        >
          Apply Recommendations
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    margin: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  motivationCard: {
    marginBottom: 24,
    backgroundColor: '#EDE7F6',
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#B00020',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  patternTitle: {
    fontWeight: '500',
    marginBottom: 8,
  },
});

export default AIInsights;
