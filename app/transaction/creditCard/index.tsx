import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';



export default function TransactionScreen() {
  const router: Router = useRouter();
  const { qrData } = useLocalSearchParams<{ qrData: string }>();


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerText}>Chọn phương thức chuyển tiền</ThemedText>
        </ThemedView>

        <ThemedView style={{ backgroundColor: 'transparent', flex: 10, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <ThemedView style={styles.body}>
            <ThemedView style={styles.containerOptionRow}>
              <TouchableOpacity style={styles.optionRow}>
                <ThemedText style={styles.bodyText}>Tài khoản ngân hàng</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ backgroundColor: 'transparent', flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.buttonFooter}
          >
            <ThemedText>Tiếp tục</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
  },

  content: {
    width: '90%',
    height: '90%',
    backgroundColor: Colors.light.text,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  header: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tabIconDefault,
  },

  body: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5%',
  },
  containerOptionRow: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '16%',
  },
  optionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderColor: Colors.light.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: '5%',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  miniIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  bodyText: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },

  buttonFooter: {
    width: '85%',
    borderRadius: 5,
    backgroundColor: Colors.light.tabIconSelected,
    paddingVertical: '1.8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});