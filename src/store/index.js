import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import userReducer from './slices/userSlice';
import focusReducer from './slices/focusSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    user: userReducer,
    focus: focusReducer,
  },
});

export default store;
