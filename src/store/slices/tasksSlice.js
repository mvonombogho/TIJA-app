import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Add new task
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    // Complete a task
    completeTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completed = true;
      }
    },
    // Delete a task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    // Update a task
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates };
      }
    },
    // Set all tasks (e.g., when fetching from API)
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addTask, 
  completeTask, 
  deleteTask, 
  updateTask, 
  setTasks,
  setLoading,
  setError 
} = tasksSlice.actions;

export default tasksSlice.reducer;
