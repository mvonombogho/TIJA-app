import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';

// In a real app, we would use a charting library like react-native-chart-kit
// This is a placeholder implementation with mock UI

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CHART_HEIGHT = 180;
const BAR_WIDTH = 32;
const MAX_VALUE = 100;

const ProductivityChart = ({ 
  data = [], 
  title = 'Weekly Productivity',
  style 
}) => {
  // Generate mock data if not provided
  const chartData = data.length > 0 ? data : [
    { day: 'Sun', value: 65, label: '1h 5m' },
    { day: 'Mon', value: 85, label: '1h 25m' },
    { day: 'Tue', value: 40, label: '40m' },
    { day: 'Wed', value: 70, label: '1h 10m' },
    { day: 'Thu', value: 95, label: '1h 35m' },
    { day: 'Fri', value: 50, label: '50m' },
    { day: 'Sat', value: 20, label: '20m' },
  ];

  return (
    <Surface style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((item, index) => {
            const barHeight = (item.value / MAX_VALUE) * CHART_HEIGHT;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight,
                      backgroundColor: getBarColor(item.value),
                    }
                  ]} 
                />
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Surface>
  );
};

// Helper function to get bar color based on value
const getBarColor = (value) => {
  if (value >= 80) {
    return '#4CAF50'; // High productivity - Green
  } else if (value >= 50) {
    return '#6200ee'; // Medium productivity - Purple
  } else {
    return '#9E9E9E'; // Low productivity - Grey
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  chartContainer: {
    marginVertical: 8,
  },
  chart: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 24, // Space for labels above bars
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  barLabelContainer: {
    position: 'absolute',
    top: -20,
    width: BAR_WIDTH,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
  },
  bar: {
    width: BAR_WIDTH - 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductivityChart;
