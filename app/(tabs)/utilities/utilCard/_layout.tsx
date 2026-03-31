import { headerTransaction } from '@/app/transaction/_layout';
import { BackgroundView } from '@/components/background-view';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';



export default function UtilCardLayout() {

  return (
    <BackgroundView>
      <Stack
        screenOptions={{
          header: headerTransaction("Dịch vụ thẻ"),
          contentStyle: styles.container
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="ccPayment" />
        <Stack.Screen name="lockCard" />
        {/* <Stack.Screen name="statement" /> */}
        {/* <Stack.Screen name="create" /> */}
      </Stack>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  }
});