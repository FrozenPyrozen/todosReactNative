import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import TaskDetailsScreen from '@/app/screens/TaskDetailsScreen/TaskDetailsScreen';
import TaskListScreen from '@/app/screens/TaskListScreen/TaskListScreen';
import { SCREEN_NAMES } from '@/constants/screenNames';
import { TaskProvider } from '@/context/TaskContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootStackParamList } from '@/types/navigation';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TaskProvider>
        <Stack.Navigator initialRouteName={SCREEN_NAMES.TASK_LIST}>
          <Stack.Screen
            name={SCREEN_NAMES.TASK_LIST}
            component={TaskListScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.TASK_DETAILS}
            component={TaskDetailsScreen}
          />
        </Stack.Navigator>
      </TaskProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
