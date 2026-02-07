import { Stack } from 'expo-router';



export default function RootLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen name="checkin" options={{ headerShown: false }} /> */}
            {/* <Stack.Screen name="checkout" options={{ headerShown: false }} /> */}
        </Stack>
    );
}
