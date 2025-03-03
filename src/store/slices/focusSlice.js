import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
  currentTask: null,
  focusTime: 25 * 60, // Default 25 minutes in seconds
  breakTime: 5 * 60, // Default 5 minutes in seconds
  elapsedTime: 0,
  totalFocusTime: 0,
  currentSession: null,
  sessions: [], // History of focus sessions
  insight: {
    recommendedFocusTime: 25,
    recommendedBreakTime: 5,
    mostProductiveHour: null,
    productivityScore: 0,
  }
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    // Toggle focus timer (start/pause)
    toggleFocusTimer: (state) => {
      state.isActive = !state.isActive;
      
      // If starting a new session and no current session exists
      if (state.isActive && !state.currentSession) {
        state.currentSession = {
          id: Date.now().toString(),
          startTime: new Date().toISOString(),
          taskId: state.currentTask?.id || null,
          planned: state.focusTime,
          actual: 0,
          completed: false,
        };
      }
    },
    // Update elapsed time during focus session
    updateElapsedTime: (state, action) => {
      state.elapsedTime = action.payload;
      
      // Update current session if active
      if (state.currentSession) {
        state.currentSession.actual = action.payload;
      }
    },
    // Complete the current focus session
    completeSession: (state) => {
      if (state.currentSession) {
        state.currentSession.completed = true;
        state.currentSession.endTime = new Date().toISOString();
        state.sessions.push(state.currentSession);
        state.totalFocusTime += state.currentSession.actual;
        state.currentSession = null;
      }
      
      state.isActive = false;
      state.elapsedTime = 0;
    },
    // Reset the focus timer
    resetFocusTimer: (state) => {
      state.isActive = false;
      state.elapsedTime = 0;
      state.currentSession = null;
    },
    // Set the current task for focus
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    // Update focus time setting
    setFocusTime: (state, action) => {
      state.focusTime = action.payload * 60; // Convert minutes to seconds
    },
    // Update break time setting
    setBreakTime: (state, action) => {
      state.breakTime = action.payload * 60; // Convert minutes to seconds
    },
    // Update focus insights
    updateInsights: (state, action) => {
      state.insight = {
        ...state.insight,
        ...action.payload
      };
    },
  },
});

export const { 
  toggleFocusTimer, 
  updateElapsedTime, 
  completeSession, 
  resetFocusTimer,
  setCurrentTask,
  setFocusTime,
  setBreakTime,
  updateInsights
} = focusSlice.actions;

export default focusSlice.reducer;
