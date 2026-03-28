import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import PushNotificationManager from '@/components/PushNotificationManager';
import { useSegments } from 'expo-router';

import { useSelector, Provider } from "react-redux";
import { store, ReduxTypes } from '@/store/reduxStore';


const AppLayout = () => {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const token = useSelector((state: ReduxTypes['RootState']) => state.auth.token);

  const inAuthScreen = segments[0] === "(tabs)" || segments[0] === "transaction";

  if (!token && inAuthScreen) {
    return <Redirect href="/" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transaction" />
      </Stack>
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PushNotificationManager>
        <AppLayout />
      </PushNotificationManager>
    </Provider>
  );
};