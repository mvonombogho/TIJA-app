import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Checkbox, IconButton, Surface } from 'react-native-paper';
import { formatDate } from '../utils/helpers';

const TaskItem = ({ 
  task, 
  onPress, 
  onComplete, 
  onDelete,
  style 
}) => {
  const { id, title, description, dueDate, priority, completed } = task;
  
  // Get priority color
  const getPriorityColor = () => {
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

  return (
    <Surface style={[styles.surface, style]}>
      <TouchableOpacity 
        onPress={() => onPress(task)}
        style={styles.container}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={completed ? 'checked' : 'unchecked'}
            onPress={() => onComplete(id)}
            color="#6200ee"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text 
              style={[
                styles.title, 
                completed && styles.completedText
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            
            <View style={[
              styles.priorityIndicator, 
              { backgroundColor: getPriorityColor() }
            ]} />
          </View>
          
          {description ? (
            <Text 
              style={[
                styles.description, 
                completed && styles.completedText
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          ) : null}
          
          {dueDate ? (
            <Text style={styles.dueDate}>
              Due: {formatDate(dueDate)}
            </Text>
          ) : null}
        </View>
        
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => onDelete(id)}
          style={styles.deleteButton}
          color="#757575"
        />
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    elevation: 2,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 2,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    justifyContent: 'center',
    marginRight: 8,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#888',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  deleteButton: {
    margin: 0,
    alignSelf: 'center',
  },
});

export default TaskItem;
