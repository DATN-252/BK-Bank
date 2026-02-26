import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
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

        <ThemedView style={styles.body}>
          <TouchableOpacity style={styles.item} onPress={() => router.push('/future')}>
            <Image source={require('../../assets/images/icon-bank.png')} style={styles.icon} />
            <ThemedText style={styles.bodyText}>Tài khoản ngân hàng</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => router.push('/future')}>
            <Image source={require('../../assets/images/icon-debitcard.png')} style={styles.icon} />
            <ThemedText style={styles.bodyText}>Thẻ nội địa</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push({
                pathname: '/transaction/creditCard',
                params: {
                  qrData: qrData,
                },
              })}>
            <Image source={require('../../assets/images/icon-creditcard.png')} style={styles.icon} />
            <ThemedView>
              <ThemedText style={styles.bodyText}>Thẻ thanh toán quốc tế/ tín dụng</ThemedText>
              <ThemedView style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', }}>
                <Image source={require('../../assets/images/mastercard_logo.png')} style={styles.miniIcon} />
                <Image source={require('../../assets/images/icon-visa.png')} style={styles.miniIcon} />
                <Image source={require('../../assets/images/icon-jcb.png')} style={styles.miniIcon} />
                <Image source={require('../../assets/images/icon-amexpr.png')} style={styles.miniIcon} />
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
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
    flex: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5%',
  },
  item: {
    width: '100%',
    height: '16%',
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
});