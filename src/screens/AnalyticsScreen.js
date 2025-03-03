import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text, Card, Button, Title, Paragraph, Portal, IconButton, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ProductivityChart from '../components/ProductivityChart';
import AIInsights from '../components/AIInsights';
import { calculateProductiveTime, getMostProductiveHour } from '../utils/helpers';

const AnalyticsScreen = () => {
  const [showInsights, setShowInsights] = useState(false);
  
  // Get data from Redux store
  const tasks = useSelector(state => state.tasks.tasks);
  const focusSessions = useSelector(state => state.focus.sessions);
  const totalFocusTime = useSelector(state => state.focus.totalFocusTime);
  
  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Format total focus time (in seconds) to hours and minutes
  const formatFocusTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Prepare data for productivity chart
  const getProductivityData = () => {
    // In a real app, this would aggregate actual focus session data
    // This is mock data for demonstration
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    return daysOfWeek.map((day, index) => {
      // Generate some random data for demo purposes
      const value = Math.floor(Math.random() * 80) + 20; // Random value between 20-100
      const minutes = Math.floor(value * 1.2); // Convert to minutes for label
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      
      return {
        day,
        value,
        label,
        // Highlight today
        isToday: index === today,
      };
    });
  };
  
  // Get most productive hour based on focus sessions
  const mostProductiveHour = getMostProductiveHour(focusSessions) || 9; // Default to 9 AM if no data
  
  // Format the hour for display
  const formatHour = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${suffix}`;
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Productivity Insights</Text>
          <IconButton 
            icon="lightbulb" 
            size={24}
            color="#6200ee"
            onPress={() => setShowInsights(true)}
          />
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Weekly Summary</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedTasks}</Text>
                <Text style={styles.statLabel}>Tasks Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatFocusTime(totalFocusTime)}</Text>
                <Text style={styles.statLabel}>Focus Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completionRate}%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Productivity Trends</Title>
            <Paragraph>Your focus time throughout the week</Paragraph>
            <ProductivityChart data={getProductivityData()} />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>AI Insights</Title>
            <Divider style={styles.divider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Best Focus Time</Text>
              <Text style={styles.insightContent}>You're most productive around {formatHour(mostProductiveHour)}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Task Completion Pattern</Text>
              <Text style={styles.insightContent}>You complete more tasks when you start with the hardest one</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Break Optimization</Text>
              <Text style={styles.insightContent}>Taking 5-minute breaks every 25 minutes improves your focus</Text>
            </View>
            <Button 
              mode="contained" 
              style={styles.insightsButton}
              onPress={() => setShowInsights(true)}
            >
              View Detailed Insights
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* AI Insights Modal */}
      <Portal>
        <Modal
          visible={showInsights}
          onDismiss={() => setShowInsights(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <AIInsights onClose={() => setShowInsights(false)} />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  insightItem: {
    marginVertical: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  insightContent: {
    color: '#666',
    marginTop: 4,
  },
  insightsButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    margin: 0,
  },
});

export default AnalyticsScreen;
