import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, List, Switch, Divider } from 'react-native-paper';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Text size={80} label="TJ" style={styles.avatar} />
        <Text style={styles.name}>Test User</Text>
        <Text style={styles.email}>test@example.com</Text>
        <Button 
          mode="outlined" 
          style={styles.editButton}
          labelStyle={styles.editButtonText}
        >
          Edit Profile
        </Button>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productivity Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Avg. Completion</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <List.Section style={styles.listSection}>
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <Switch value={true} onValueChange={() => {}} />}
          />
          <Divider />
          <List.Item
            title="Focus Mode"
            description="Automatically mute notifications during focus sessions"
            left={props => <List.Icon {...props} icon="timer" />}
            right={props => <Switch value={true} onValueChange={() => {}} />}
          />
          <Divider />
          <List.Item
            title="AI Personalization"
            description="Allow app to learn from your habits"
            left={props => <List.Icon {...props} icon="brain" />}
            right={props => <Switch value={true} onValueChange={() => {}} />}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <Switch value={false} onValueChange={() => {}} />}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="About"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      </View>
      
      <Button 
        mode="text" 
        style={styles.logoutButton}
        color="#f44336"
      >
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    borderColor: '#6200ee',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: '#6200ee',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listSection: {
    backgroundColor: '#fff',
  },
  logoutButton: {
    margin: 16,
  },
});

export default ProfileScreen;
