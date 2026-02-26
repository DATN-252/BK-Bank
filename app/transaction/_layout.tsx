import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Router, useRouter } from 'expo-router';
import { BackgroundView } from '@/components/background-view';


export const headerTransaction = (router: Router, title: string) => () => {
  return (
    <ThemedView style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="left" size={24} color={Colors.light.icon} />
      </TouchableOpacity>

      <ThemedText type="subtitle">{title}</ThemedText>

      <TouchableOpacity onPress={() => router.replace('/home')}>
        <FontAwesome name="home" size={24} color={Colors.light.icon} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default function TransactionLayout() {
  const router: Router = useRouter();


  return (
    <BackgroundView>
      <Stack screenOptions={{ header: headerTransaction(router, "Chuyển tiền"), contentStyle: styles.statusBar }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="creditCard" />
        {/* <Stack.Screen name="debitCard" /> */}
        {/* <Stack.Screen name="accountNumber" /> */}
      </Stack>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: 'transparent',
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: '7%',
    paddingHorizontal: '6%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
