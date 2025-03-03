import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text, Button, Card, Chip, Divider, Portal, IconButton, Dialog, List } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleFocusTimer, 
  updateElapsedTime, 
  completeSession, 
  resetFocusTimer,
  setCurrentTask,
  setFocusTime 
} from '../store/slices/focusSlice';
import FocusTimer from '../components/FocusTimer';
import AISuggestions from '../components/AISuggestions';
import AIInsights from '../components/AIInsights';

const FocusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const focus = useSelector(state => state.focus);
  const tasks = useSelector(state => state.tasks.tasks);
  
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  
  const { 
    isActive, 
    currentTask, 
    focusTime, 
    elapsedTime
  } = focus;
  
  // Handle timer toggle
  const handleToggleTimer = () => {
    dispatch(toggleFocusTimer());
  };
  
  // Handle timer reset
  const handleResetTimer = () => {
    dispatch(resetFocusTimer());
  };
  
  // Handle timer completion
  const handleCompleteTimer = () => {
    dispatch(completeSession());
  };
  
  // Handle time update
  const handleTimeUpdate = (time) => {
    dispatch(updateElapsedTime(time));
  };
  
  // Handle task selection
  const handleTaskSelect = (task) => {
    dispatch(setCurrentTask(task));
    setShowTaskSelector(false);
  };
  
  // Handle AI task selection
  const handleAITaskSelect = (suggestedTask) => {
    // Create a task object from the suggestion
    const task = {
      id: suggestedTask.id,
      title: suggestedTask.title,
      priority: suggestedTask.priority,
      estimatedMinutes: suggestedTask.estimatedMinutes,
    };
    
    dispatch(setCurrentTask(task));
  };
  
  // Handle duration change
  const handleDurationChange = (minutes) => {
    setSelectedDuration(minutes);
    dispatch(setFocusTime(minutes));
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Focus Session</Text>
          <IconButton 
            icon="lightbulb" 
            size={24}
            color="#6200ee"
            onPress={() => setShowInsights(true)}
          />
        </View>
        
        <FocusTimer
          initialTime={focusTime}
          isActive={isActive}
          onComplete={handleCompleteTimer}
          onTimeUpdate={handleTimeUpdate}
          onToggle={handleToggleTimer}
          onReset={handleResetTimer}
        />
        
        <Card style={styles.taskCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Current Task</Text>
            
            {currentTask ? (
              <View style={styles.currentTaskContainer}>
                <Text style={styles.currentTaskTitle}>{currentTask.title}</Text>
                {currentTask.estimatedMinutes && (
                  <Chip icon="clock-outline" style={styles.estimateChip}>
                    {currentTask.estimatedMinutes} min
                  </Chip>
                )}
                <Button
                  mode="outlined"
                  style={styles.changeTaskButton}
                  onPress={() => setShowTaskSelector(true)}
                >
                  Change Task
                </Button>
              </View>
            ) : (
              <View style={styles.noTaskContainer}>
                <Text style={styles.placeholderText}>
                  Select a task to focus on
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setShowTaskSelector(true)}
                  style={styles.selectTaskButton}
                >
                  Select Task
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Session Length</Text>
          <View style={styles.chipContainer}>
            <Chip 
              selected={selectedDuration === 15} 
              onPress={() => handleDurationChange(15)} 
              style={styles.chip}
            >
              15 min
            </Chip>
            <Chip 
              selected={selectedDuration === 25} 
              onPress={() => handleDurationChange(25)} 
              style={styles.chip}
            >
              25 min
            </Chip>
            <Chip 
              selected={selectedDuration === 50} 
              onPress={() => handleDurationChange(50)} 
              style={styles.chip}
            >
              50 min
            </Chip>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <AISuggestions 
          onTaskSelect={handleAITaskSelect}
          style={styles.suggestions}
        />
      </ScrollView>
      
      {/* Task Selection Dialog */}
      <Portal>
        <Dialog
          visible={showTaskSelector}
          onDismiss={() => setShowTaskSelector(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Select a Task</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.taskList}>
              {tasks.length > 0 ? (
                tasks
                  .filter(task => !task.completed)
                  .map(task => (
                    <List.Item
                      key={task.id}
                      title={task.title}
                      description={
                        task.estimatedMinutes 
                          ? `Est. ${task.estimatedMinutes} min` 
                          : undefined
                      }
                      left={props => (
                        <List.Icon 
                          {...props} 
                          icon={
                            task.priority === 'high' 
                              ? 'flag' 
                              : 'flag-outline'
                          } 
                          color={
                            task.priority === 'high' 
                              ? '#FF5252' 
                              : task.priority === 'medium' 
                                ? '#FFD740' 
                                : '#BDBDBD'
                          }
                        />
                      )}
                      onPress={() => handleTaskSelect(task)}
                    />
                  ))
              ) : (
                <Text style={styles.noTasksText}>
                  No tasks available. Add tasks from the Tasks tab.
                </Text>
              )}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowTaskSelector(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
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
  taskCard: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  currentTaskContainer: {
    marginTop: 8,
  },
  currentTaskTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  estimateChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  changeTaskButton: {
    marginTop: 8,
  },
  noTaskContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  placeholderText: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  selectTaskButton: {
    marginTop: 8,
  },
  settingsContainer: {
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 24,
  },
  suggestions: {
    marginBottom: 24,
  },
  dialog: {
    maxHeight: '80%',
  },
  taskList: {
    maxHeight: 300,
  },
  noTasksText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    margin: 0,
  },
});

export default FocusScreen;
