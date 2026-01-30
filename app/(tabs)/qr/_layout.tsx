import { Stack } from 'expo-router';



export default function QRLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="my-qr" options={{ headerShown: false }} />
    </Stack>
  );
}