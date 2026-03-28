import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
// import { Image } from 'expo-image';
import { Router, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';



export default function FutureScreen() {
  const router: Router = useRouter();

  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
            <AntDesign name="info-circle" size={50} color={'#36ADFF'} />
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Coming Soon</ThemedText>
          </ThemedView>

          <ThemedView style={styles.body}>
             {/* <Image source={require('@/assets/images/logo-bank.png')} style={styles.logo} /> */}
            <ThemedText type='subtitle' style={{ textAlign: 'center' }}>
              Tính năng đang được phát triển. Hãy quay lại sau!
            </ThemedText> 
          </ThemedView>

            <ThemedView style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
              <ThemedText style={styles.buttonText}>Quay về trang chủ</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => router.back()}>
              <ThemedText style={styles.buttonText}>Quay lại</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    gap: 24,
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    minHeight: '50%',
    backgroundColor: Colors.light.background,
    borderRadius: 24,
  },

  header: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },

  body: {
    backgroundColor: 'transparent',
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#36ADFF',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    shadowColor: '#36ADFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  footer: {
    backgroundColor: 'transparent',
    flex: 2,  
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});