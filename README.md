# TIJA

An AI-Powered Productivity Coach App built with React Native

## Overview

TIJA is designed to be an intelligent productivity assistant that helps users manage tasks, optimize focus time, and improve work habits using AI-driven insights.

## Key Features

- **Smart Task Prioritization**: AI-powered ranking of tasks based on deadlines, importance, and estimated completion time
- **Focus Time Management**: Pomodoro-style focus sessions optimized to individual work patterns
- **Break Optimization**: Suggesting optimal break times based on productivity metrics
- **Distraction Defense**: Notification management and focus mode to minimize interruptions
- **Work Pattern Analysis**: Identifying when the user is most productive and scheduling important tasks accordingly
- **Progress Tracking**: Visualizations of productivity trends and accomplishments

## AI-Powered Features

TIJA integrates several AI-powered features using the DeepSeek API:

- **Productivity Insights**: Analyzes your work patterns to provide personalized recommendations
- **Task Optimization**: Suggests the best order for completing tasks based on your productivity patterns
- **Schedule Generation**: Creates optimized daily schedules based on your tasks and habits
- **Personalized Motivation**: Generates motivational messages based on your progress and challenges

## Tech Stack

- **Frontend**: React Native
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Navigation**: React Navigation
- **Backend**: Firebase (Authentication, Firestore)
- **AI/ML**: DeepSeek API

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- DeepSeek API key
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/mvonombogho/TIJA-app.git
cd TIJA-app

# Install dependencies
npm install

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

### Using Android Studio

To open and run the project in Android Studio:

1. Open Android Studio
2. Select "Open an Existing Project"
3. Navigate to your TIJA-app folder and select the "android" folder
4. Wait for the Gradle sync to complete
5. Connect an Android device or start an emulator
6. Click the "Run" button (green triangle) in the toolbar

#### Troubleshooting Android Studio Issues

If you encounter Gradle sync issues:
- Make sure you have the latest version of Android Studio
- Update the Gradle plugin if prompted
- Check the build.gradle files for any dependency conflicts

If you get SDK location errors:
- Go to File > Settings > Appearance & Behavior > System Settings > Android SDK
- Make sure the Android SDK is properly set up
