import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Surface, 
  RadioButton, 
  Appbar,
  Dialog,
  Portal,
  Checkbox 
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { generateId } from '../utils/helpers';

const TaskFormScreen = ({ route, navigation }) => {
  // Get existing task if editing
  const existingTask = route.params?.task;
  const isEditing = !!existingTask;
  
  // Task state
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState(existingTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : new Date()
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    existingTask?.estimatedMinutes?.toString() || ''
  );
  const [categories, setCategories] = useState(existingTask?.categories || []);
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  
  // Available categories (In a real app, these would come from the store/API)
  const availableCategories = [
    'Work',
    'Personal',
    'Health',
    'Learning',
    'Finance',
    'Home',
    'Other'
  ];
  
  // Validate form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    
    if (!title.trim()) {
      formErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (estimatedMinutes && isNaN(Number(estimatedMinutes))) {
      formErrors.estimatedMinutes = 'Must be a number';
      isValid = false;
    }
    
    setErrors(formErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate.toISOString(),
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : null,
      categories,
      completed: existingTask?.completed || false,
    };
    
    if (isEditing) {
      dispatch(updateTask({
        id: existingTask.id,
        ...taskData
      }));
    } else {
      dispatch(addTask({
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...taskData
      }));
    }
    
    navigation.goBack();
  };
  
  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  // Format date for display
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle category selection
  const toggleCategory = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };
  
  // Add new custom category
  const addNewCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryDialog(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? "Edit Task" : "Add Task"} />
        {isEditing && (
          <Appbar.Action icon="delete" onPress={() => {
            // Handle delete
            navigation.goBack();
          }} />
        )}
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.formContainer}>
          <TextInput
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            error={!!errors.title}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          
          <Text style={styles.sectionTitle}>Priority</Text>
          <RadioButton.Group onValueChange={value => setPriority(value)} value={priority}>
            <View style={styles.radioGroup}>
              <View style={styles.radioItem}>
                <RadioButton value="high" color="#6200ee" />
                <Text>High</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="medium" color="#6200ee" />
                <Text>Medium</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="low" color="#6200ee" />
                <Text>Low</Text>
              </View>
            </View>
          </RadioButton.Group>
          
          <Text style={styles.sectionTitle}>Due Date</Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateSelector}
          >
            <Text style={styles.dateText}>{formatDisplayDate(dueDate)}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          
          <TextInput
            label="Estimated Minutes"
            value={estimatedMinutes}
            onChangeText={setEstimatedMinutes}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.estimatedMinutes}
          />
          {errors.estimatedMinutes && (
            <Text style={styles.errorText}>{errors.estimatedMinutes}</Text>
          )}
          
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            {availableCategories.map(category => (
              <View key={category} style={styles.categoryItem}>
                <Checkbox
                  status={categories.includes(category) ? 'checked' : 'unchecked'}
                  onPress={() => toggleCategory(category)}
                  color="#6200ee"
                />
                <Text>{category}</Text>
              </View>
            ))}
            <Button 
              mode="outlined" 
              onPress={() => setShowCategoryDialog(true)}
              style={styles.addCategoryButton}
            >
              Add Custom Category
            </Button>
          </View>
        </Surface>
      </ScrollView>
      
      <Surface style={styles.bottomBar}>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </Surface>
      
      <Portal>
        <Dialog
          visible={showCategoryDialog}
          onDismiss={() => setShowCategoryDialog(false)}
        >
          <Dialog.Title>Add Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCategoryDialog(false)}>Cancel</Button>
            <Button onPress={addNewCategory}>Add</Button>
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCategoryButton: {
    marginTop: 8,
  },
  bottomBar: {
    padding: 16,
    elevation: 4,
  },
  submitButton: {
    paddingVertical: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
  },
});

export default TaskFormScreen;
