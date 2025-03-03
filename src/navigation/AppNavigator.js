import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from '../services/firebase';
import { setUser, setAuthenticated } from '../store/slices/userSlice';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import TasksScreen from '../screens/TasksScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import FocusScreen from '../screens/FocusScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tasks stack navigator
const TasksStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TasksList" 
        component={TasksScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TaskForm" 
        component={TaskFormScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Focus') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TasksStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Focus" 
        component={FocusScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication state when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
        dispatch(setAuthenticated(true));
      } else {
        dispatch(setAuthenticated(false));
      }
      setAuthChecked(true);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);
  
  // Show nothing while checking auth state
  if (!authChecked) {
    return null;
  }
  
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
