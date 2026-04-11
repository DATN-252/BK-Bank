import { headerTransaction } from '@/app/transaction/_layout';
import { BackgroundView } from '@/components/background-view';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';



export default function UtilCardLayout() {

  return (
    <BackgroundView>
      <Stack>
        <Stack.Screen name="index" options={{
          header: headerTransaction("Dịch vụ thẻ"),
          contentStyle: styles.container
        }} />
        <Stack.Screen name="ccPayment" options={{
          header: headerTransaction("Thanh toán thẻ"),
          contentStyle: styles.container
        }}/>
        <Stack.Screen name="lockCard" options={{
          header: headerTransaction("Khóa/Mở thẻ"),
          contentStyle: styles.container
        }}/>
        <Stack.Screen name="statement" options={{
          header: headerTransaction("Sao kê tín dụng"),
          contentStyle: styles.container
        }} />
        {/* <Stack.Screen name="success" options={{
          header: headerTransaction("Kết quả giao dịch"),
          contentStyle: styles.container
        }} /> */}
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