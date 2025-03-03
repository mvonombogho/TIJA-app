import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Authentication methods
export const firebaseAuth = {
  // Sign up with email and password
  registerWithEmail: async (email, password, userProfile) => {
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;
      
      // Add user profile data to Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          email: user.email,
          displayName: userProfile.displayName || '',
          photoURL: userProfile.photoURL || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...userProfile
        });
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  // Sign in with email and password
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Sign out
  logout: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: () => auth().currentUser,
  
  // Reset password
  resetPassword: async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profile) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile(profile);
        
        // Also update in Firestore
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            displayName: profile.displayName || user.displayName,
            photoURL: profile.photoURL || user.photoURL,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
      }
    } catch (error) {
      throw error;
    }
  },
};

// Firestore data services
export const firestoreDB = {
  // Tasks collection
  tasks: {
    // Get all tasks for current user
    getUserTasks: async () => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const tasksSnapshot = await firestore()
          .collection('tasks')
          .where('userId', '==', user.uid)
          .orderBy('createdAt', 'desc')
          .get();
        
        return tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        throw error;
      }
    },
    
    // Add a new task
    addTask: async (taskData) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const taskRef = await firestore().collection('tasks').add({
          userId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          completed: false,
          ...taskData
        });
        
        const newTask = await taskRef.get();
        
        return {
          id: newTask.id,
          ...newTask.data()
        };
      } catch (error) {
        throw error;
      }
    },
    
    // Update a task
    updateTask: async (taskId, updates) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Verify task belongs to user
        const taskDoc = await firestore().collection('tasks').doc(taskId).get();
        if (!taskDoc.exists || taskDoc.data().userId !== user.uid) {
          throw new Error('Task not found or unauthorized');
        }
        
        await firestore()
          .collection('tasks')
          .doc(taskId)
          .update({
            ...updates,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });
        
        return {
          id: taskId,
          ...taskDoc.data(),
          ...updates
        };
      } catch (error) {
        throw error;
      }
    },
    
    // Delete a task
    deleteTask: async (taskId) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Verify task belongs to user
        const taskDoc = await firestore().collection('tasks').doc(taskId).get();
        if (!taskDoc.exists || taskDoc.data().userId !== user.uid) {
          throw new Error('Task not found or unauthorized');
        }
        
        await firestore().collection('tasks').doc(taskId).delete();
        
        return taskId;
      } catch (error) {
        throw error;
      }
    },
  },
  
  // Focus sessions collection
  focusSessions: {
    // Get user's focus sessions
    getUserSessions: async () => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const sessionsSnapshot = await firestore()
          .collection('focusSessions')
          .where('userId', '==', user.uid)
          .orderBy('startTime', 'desc')
          .get();
        
        return sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        throw error;
      }
    },
    
    // Add a new focus session
    addSession: async (sessionData) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const sessionRef = await firestore().collection('focusSessions').add({
          userId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...sessionData
        });
        
        const newSession = await sessionRef.get();
        
        return {
          id: newSession.id,
          ...newSession.data()
        };
      } catch (error) {
        throw error;
      }
    },
    
    // Update a focus session
    updateSession: async (sessionId, updates) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        await firestore()
          .collection('focusSessions')
          .doc(sessionId)
          .update({
            ...updates,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });
        
        return sessionId;
      } catch (error) {
        throw error;
      }
    },
  },
  
  // User settings and preferences
  userSettings: {
    // Get user settings
    getUserSettings: async () => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const settingsDoc = await firestore()
          .collection('userSettings')
          .doc(user.uid)
          .get();
        
        if (!settingsDoc.exists) {
          // Create default settings if they don't exist
          const defaultSettings = {
            notifications: true,
            focusMode: true,
            aiPersonalization: true,
            darkMode: false,
            focusTime: 25,
            breakTime: 5,
          };
          
          await firestore()
            .collection('userSettings')
            .doc(user.uid)
            .set({
              ...defaultSettings,
              userId: user.uid,
              createdAt: firestore.FieldValue.serverTimestamp(),
            });
          
          return defaultSettings;
        }
        
        return settingsDoc.data();
      } catch (error) {
        throw error;
      }
    },
    
    // Update user settings
    updateSettings: async (settings) => {
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        await firestore()
          .collection('userSettings')
          .doc(user.uid)
          .update({
            ...settings,
            updatedAt: firestore.FieldValue.serverTimestamp()
          });
        
        return settings;
      } catch (error) {
        throw error;
      }
    },
  },
};

// Export a listener for auth state changes
export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};

export default {
  auth: firebaseAuth,
  db: firestoreDB,
  onAuthStateChanged,
};
