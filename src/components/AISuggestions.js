import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Card, Button, Divider, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';

const AISuggestions = ({ onTaskSelect, style }) => {
  // This would normally come from the AI service based on user patterns
  // For now, we'll use mock data
  const suggestedTasks = [
    {
      id: 'suggestion-1',
      title: 'Complete TIJA design review',
      priority: 'high',
      reason: 'Due tomorrow and aligns with your morning productivity peak',
      estimatedMinutes: 45,
    },
    {
      id: 'suggestion-2',
      title: 'Schedule team meeting',
      priority: 'medium',
      reason: 'Quick task that you can complete before deeper work',
      estimatedMinutes: 10,
    },
    {
      id: 'suggestion-3',
      title: 'Prepare project presentation',
      priority: 'high',
      reason: 'Important deadline approaching',
      estimatedMinutes: 60,
    }
  ];
  
  // Mock focus time recommendation
  const focusRecommendation = {
    duration: 25,
    breakTime: 5,
    reason: 'Based on your productivity patterns, this timing works best for you',
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#FF5252';
      case 'medium':
        return '#FFD740';
      case 'low':
        return '#69F0AE';
      default:
        return '#BDBDBD';
    }
  };
  
  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };
  
  return (
    <Surface style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Suggestions</Text>
        <IconButton 
          icon="refresh" 
          size={20}
          onPress={() => {
            // This would refresh suggestions from the AI
            console.log('Refresh suggestions');
          }}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Recommended Tasks</Text>
      
      {suggestedTasks.map((task, index) => (
        <Card 
          key={task.id}
          style={styles.taskCard}
          onPress={() => onTaskSelect && onTaskSelect(task)}
        >
          <Card.Content>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View 
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(task.priority) }
                ]} 
              />
            </View>
            
            <View style={styles.taskDetails}>
              <Text style={styles.timeEstimate}>
                {formatTime(task.estimatedMinutes)}
              </Text>
              <Text style={styles.reasonText}>{task.reason}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
      
      <Divider style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Focus Time Recommendation</Text>
      
      <Card style={styles.focusCard}>
        <Card.Content>
          <View style={styles.focusRecommendation}>
            <View style={styles.focusTimeContainer}>
              <Text style={styles.focusTimeValue}>{focusRecommendation.duration}</Text>
              <Text style={styles.focusTimeLabel}>min work</Text>
            </View>
            <Text style={styles.focusTimeSeparator}>+</Text>
            <View style={styles.focusTimeContainer}>
              <Text style={styles.focusTimeValue}>{focusRecommendation.breakTime}</Text>
              <Text style={styles.focusTimeLabel}>min break</Text>
            </View>
          </View>
          
          <Text style={styles.focusReasonText}>
            {focusRecommendation.reason}
          </Text>
          
          <Button 
            mode="contained" 
            icon="timer" 
            style={styles.button}
            onPress={() => {
              // This would start a focus session with the recommended settings
              console.log('Start focus session');
            }}
          >
            Start Focus Session
          </Button>
        </Card.Content>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6200ee',
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  focusCard: {
    marginTop: 8,
    backgroundColor: '#F3F8FF',
  },
  focusRecommendation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusTimeContainer: {
    alignItems: 'center',
  },
  focusTimeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  focusTimeLabel: {
    fontSize: 14,
    color: '#666',
  },
  focusTimeSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#6200ee',
  },
  focusReasonText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
});

export default AISuggestions;
