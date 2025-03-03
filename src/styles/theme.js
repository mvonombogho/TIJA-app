import { DefaultTheme } from 'react-native-paper';

// TIJA app theme based on react-native-paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f5f5f5',
    surface: '#ffffff',
    error: '#B00020',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
    // Custom colors for TIJA
    success: '#4CAF50',
    warning: '#FFD740',
    info: '#2196F3',
    lightBackground: '#F3E5F5',
    cardBackground: '#FFFFFF',
    focusTime: '#6200ee',
    breakTime: '#03dac4',
    taskHigh: '#FF5252',
    taskMedium: '#FFD740',
    taskLow: '#69F0AE',
  },
  fonts: {
    ...DefaultTheme.fonts,
    // You can customize fonts here if needed
  },
  // Custom properties
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24,
    round: 9999,
  },
  elevation: {
    none: 0,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
  },
};

// Dark theme (for future implementation)
export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
    primary: '#BB86FC',
    accent: '#03dac4',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    disabled: '#757575',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
    // Custom colors for TIJA
    success: '#4CAF50',
    warning: '#FFD740',
    info: '#2196F3',
    lightBackground: '#2A2A2A',
    cardBackground: '#1E1E1E',
    focusTime: '#BB86FC',
    breakTime: '#03dac4',
    taskHigh: '#FF5252',
    taskMedium: '#FFD740',
    taskLow: '#69F0AE',
  },
};

// Common styles that can be reused across the app
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: theme.elevation.sm,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  button: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
};

export default theme;
