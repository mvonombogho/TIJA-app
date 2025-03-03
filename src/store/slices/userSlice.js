import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  preferences: {
    notifications: true,
    focusMode: true,
    aiPersonalization: true,
    darkMode: false,
  },
  stats: {
    completionRate: 0,
    streakDays: 0,
    tasksCompleted: 0,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user information
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // Update authentication status
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.user = null;
      }
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Update user preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    },
    // Update user stats
    updateStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload
      };
    },
    // Clear user state (e.g., on logout)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { 
  setUser, 
  setAuthenticated, 
  setLoading, 
  setError, 
  updatePreferences,
  updateStats,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;
