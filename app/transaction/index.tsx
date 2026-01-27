import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams } from 'expo-router';



export default function TransactionScreen() {
  const { qr } = useLocalSearchParams<{ qr: string }>();


  return (
    <BackgroundView>
      <ThemedText>QR PARAM: {qr}</ThemedText>
    </BackgroundView>
  );
}
