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

### Installation

```bash
# Clone the repository
git clone https://github.com/mvonombogho/TIJA-app.git
cd TIJA-app

# Install dependencies
npm install

# Setup environment variables
# Create a .env file at project root with:
DEEPSEEK_API_KEY=your_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here

# Start Metro Bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

### Setting up DeepSeek API

1. Sign up for a DeepSeek API account at [https://deepseek.com](https://deepseek.com)
2. Create a new API key in your dashboard
3. Add the API key to your .env file as shown above
4. The app will automatically use this key to make API requests

## Project Structure

```
/src
  /assets        # Images, fonts, etc.
  /components    # Reusable UI components
  /navigation    # Navigation configuration
  /screens       # App screens
  /services      # API calls, Firebase, AI service
  /store         # Redux store, slices, actions
  /styles        # Theme and style configuration
  /utils         # Helper functions
  /hooks         # Custom hooks
  App.js         # Main app component
```

## AI Implementation

The AI features are implemented in the `src/services/aiService.js` file:

- `generateProductivityInsights()`: Analyzes user data to provide personalized insights
- `optimizeTaskSchedule()`: Creates an optimal schedule based on tasks and user patterns
- `generateMotivationMessage()`: Creates personalized motivation messages
- `analyzeOptimalFocusTimes()`: Determines when the user is most productive

To modify or extend the AI capabilities, you can adjust the prompts and API parameters in the aiService.

## Development Roadmap

- [x] Basic task management functionality
- [x] Focus timer implementation
- [x] AI-powered insights and recommendations
- [ ] User authentication with Firebase
- [ ] Cloud synchronization of tasks and focus sessions
- [ ] Push notifications for task reminders
- [ ] Advanced analytics dashboard
- [ ] Smart scheduling of recurring tasks
- [ ] Habit tracking integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
