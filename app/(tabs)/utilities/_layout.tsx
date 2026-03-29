import { Stack } from 'expo-router';


export default function UtilLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="utilCard" />
      {/* <Stack.Screen name="rechargePhone" /> */}
      {/* <Stack.Screen name="rechargeGame" /> */}
      {/* <Stack.Screen name="electricityBill" /> */}
      {/* <Stack.Screen name="movieTickets" /> */}
      {/* <Stack.Screen name="travel" /> */}
    </Stack>
  );
};