import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Button, Chip, Searchbar, Portal, Dialog, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { completeTask, deleteTask } from '../store/slices/tasksSlice';
import TaskItem from '../components/TaskItem';
import { sortTasksByPriority, groupTasksByDate } from '../utils/helpers';
import aiService from '../services/aiService';

const TasksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const userPatterns = useSelector(state => state.focus.insight);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [optimizedSchedule, setOptimizedSchedule] = useState(null);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [optimizationLoading, setOptimizationLoading] = useState(false);
  
  // Filter tasks based on search query and filter
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'completed' && task.completed) ||
      (selectedFilter === 'active' && !task.completed) ||
      (task.categories && task.categories.includes(selectedFilter));
    
    return matchesSearch && matchesFilter;
  });
  
  // Sort tasks by priority
  const sortedTasks = sortTasksByPriority(filteredTasks);
  
  // Generate available filters based on categories in tasks
  const getAvailableFilters = () => {
    const baseFilters = [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
    ];
    
    // Extract unique categories from tasks
    const categories = new Set();
    tasks.forEach(task => {
      if (task.categories && Array.isArray(task.categories)) {
        task.categories.forEach(category => categories.add(category));
      }
    });
    
    // Add category filters
    const categoryFilters = Array.from(categories).map(category => ({
      value: category,
      label: category
    }));
    
    return [...baseFilters, ...categoryFilters];
  };
  
  // Handle task completion toggle
  const handleToggleComplete = (taskId) => {
    dispatch(completeTask(taskId));
  };
  
  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };
  
  // Handle task edit/view
  const handleTaskPress = (task) => {
    navigation.navigate('TaskForm', { task });
  };
  
  // Generate optimized schedule using AI
  const generateOptimizedSchedule = async () => {
    setOptimizationLoading(true);
    
    try {
      // Get only active tasks
      const activeTasks = tasks.filter(task => !task.completed);
      
      // Use AI service to optimize task schedule
      const optimization = await aiService.optimizeTaskSchedule(activeTasks, userPatterns);
      
      setOptimizedSchedule(optimization);
      setShowOptimizationDialog(true);
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      // Use fallback schedule for development/demo
      setOptimizedSchedule(getFallbackSchedule());
      setShowOptimizationDialog(true);
    } finally {
      setOptimizationLoading(false);
    }
  };
  
  // Fallback schedule for development/demo
  const getFallbackSchedule = () => {
    return {
      schedule: [
        'Morning: Focus on high priority tasks',
        '9:00 am - Complete TIJA design review',
        '10:30 am - Schedule team meeting',
        'Afternoon: Handle medium priority tasks',
        '1:00 pm - Prepare project presentation',
        '3:00 pm - Review progress with team',
        'Evening: Address remaining tasks',
        '5:00 pm - Respond to pending emails'
      ],
      reasoning: 'This schedule places high-priority tasks during your peak productivity hours in the morning. Quick tasks are scheduled before longer focus sessions to build momentum. Breaks are incorporated between major tasks to maintain energy levels throughout the day.',
    };
  };
  
  // Render a task item
  const renderTaskItem = ({ item }) => (
    <TaskItem 
      task={item}
      onPress={handleTaskPress}
      onComplete={handleToggleComplete}
      onDelete={handleDeleteTask}
      style={styles.taskItem}
    />
  );
  
  // Render the list header
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        {`${filteredTasks.filter(task => !task.completed).length} tasks remaining`}
      </Text>
      <Button 
        mode="text" 
        icon="robot"
        loading={optimizationLoading}
        onPress={generateOptimizedSchedule}
      >
        Optimize
      </Button>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search tasks..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={getAvailableFilters()}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item.value}
              onPress={() => setSelectedFilter(item.value)}
              style={styles.filterChip}
              selectedColor={selectedFilter === item.value ? '#6200ee' : undefined}
            >
              {item.label}
            </Chip>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedFilter !== 'all'
                ? 'No matching tasks found'
                : 'No tasks yet. Add your first task!'}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => navigation.navigate('TaskForm')}
      />
      
      <Portal>
        <Dialog
          visible={showOptimizationDialog}
          onDismiss={() => setShowOptimizationDialog(false)}
        >
          <Dialog.Title>Optimized Schedule</Dialog.Title>
          <Dialog.Content>
            <View style={styles.scheduleContainer}>
              {optimizedSchedule?.schedule?.map((item, index) => (
                <View key={index}>
                  <Text 
                    style={
                      item.includes(':') && !item.includes('am') && !item.includes('pm')
                        ? styles.scheduleSection
                        : styles.scheduleItem
                    }
                  >
                    {item}
                  </Text>
                  {item.includes(':') && !item.includes('am') && !item.includes('pm') && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
            
            <Text style={styles.reasoningTitle}>Reasoning:</Text>
            <Text style={styles.reasoningText}>{optimizedSchedule?.reasoning}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowOptimizationDialog(false)}>Close</Button>
            <Button 
              mode="contained"
              onPress={() => {
                // Apply optimization - this would be implemented in a real app
                setShowOptimizationDialog(false);
              }}
            >
              Apply
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation:1,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  taskItem: {
    marginHorizontal: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80, // Provide space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  scheduleContainer: {
    marginBottom: 16,
  },
  scheduleSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 12,
    marginBottom: 4,
  },
  scheduleItem: {
    fontSize: 15,
    marginVertical: 4,
  },
  divider: {
    marginVertical: 8,
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TasksScreen;
