import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { Text, Button, ProgressBar, Surface } from 'react-native-paper';
import { formatTime } from '../utils/helpers';

const FocusTimer = ({
  initialTime = 25 * 60, // Default: 25 minutes in seconds
  isActive = false,
  onComplete,
  onTimeUpdate,
  onToggle,
  onReset,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeRemaining(initialTime);
    setProgress(0);
  }, [initialTime]);

  // Handle timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(intervalRef.current);
            if (onComplete) onComplete();
            Vibration.vibrate([500, 500, 500]); // Vibrate to notify completion
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onComplete]);

  // Update progress
  useEffect(() => {
    const calculatedProgress = 1 - (timeRemaining / initialTime);
    setProgress(calculatedProgress);
    
    if (onTimeUpdate) {
      onTimeUpdate(timeRemaining);
    }
  }, [timeRemaining, initialTime, onTimeUpdate]);

  const handleReset = () => {
    setTimeRemaining(initialTime);
    setProgress(0);
    if (onReset) onReset();
  };

  return (
    <Surface style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      
      <ProgressBar 
        progress={progress} 
        color="#6200ee" 
        style={styles.progressBar} 
      />
      
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={onToggle}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleReset}
          style={styles.button}
          labelStyle={styles.buttonOutlineLabel}
          disabled={isActive}
        >
          Reset
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '200',
    color: '#6200ee',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonOutlineLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6200ee',
  },
});

export default FocusTimer;
