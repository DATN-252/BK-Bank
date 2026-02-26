import { StyleSheet, TouchableOpacity } from 'react-native';

import { BackgroundView } from '@/components/background-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';



export default function HomeScreen() {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);



  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type='subtitle' style={styles.textHeader}>Xin chào</ThemedText>
            <ThemedText type='title' style={styles.textHeader}>Nguyen Van A</ThemedText>
          </ThemedView>

          <ThemedView style={styles.body}>
            <ThemedView style={styles.infoCard}>
              <ThemedView style={styles.cardHeader}>
                <ThemedText style={{ opacity: 0.6 }}>Số dư hiện tại</ThemedText>
                {showPassword ?
                  <TouchableOpacity onPress={() => setShowPassword(false)}>
                    <FontAwesome name="eye-slash" size={24} color={Colors.light.icon} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => setShowPassword(true)}>
                    <FontAwesome name="eye" size={24} color={Colors.light.icon} />
                  </TouchableOpacity>
                }
              </ThemedView>
              <ThemedText
                type='title'
                style={styles.textHeader}
                adjustsFontSizeToFit
                numberOfLines={1}
              >{showPassword ? "1.234.565.899" : "***********"} VND</ThemedText>
              <ThemedText style={styles.textCard}>{showPassword ? "**** **** **** 1289" : "**** **** **** ****"}</ThemedText>
              <ThemedView style={styles.cardFooter}>
                <ThemedText style={styles.textCard}>{showPassword ? "09/25" : "**/**"}</ThemedText>
                <Image source={require('@/assets/images/mastercard_logo.png')} style={{ width: '15%', aspectRatio: 1, resizeMode: 'contain' }} />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.utilities}>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity
                  style={styles.iconBackground}
                  onPress={() => router.push('/transaction')}
                >
                  <AntDesign name="user-switch" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
                <ThemedText style={styles.textUtil}>Chuyển tiền</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity
                  style={styles.iconBackground}
                  onPress={() => { router.push('/qr') }}
                >
                  <AntDesign name="scan" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
                <ThemedText style={styles.textUtil}>Mã QR</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity style={styles.iconBackground} onPress={() => router.push('/future')}><AntDesign name="wallet" size={24} color={Colors.light.icon} /></TouchableOpacity>
                <ThemedText style={styles.textUtil}>Mở thẻ</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity style={styles.iconBackground} onPress={() => { router.push('/utilities') }}><AntDesign name="ellipsis" size={24} color={Colors.light.icon} /></TouchableOpacity>
                <ThemedText style={styles.textUtil}>Khác</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

        </ThemedView>
      </ThemedView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '90%',
  },

  header: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  textHeader: {
    color: Colors.light.text,
    lineHeight: 35,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },

  body: {
    backgroundColor: 'transparent',
    width: '100%',
  },

  infoCard: {
    paddingHorizontal: '5%',
    borderRadius: 10,
    height: '50%',
    justifyContent: 'space-evenly',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textCard: {
    letterSpacing: 2,
  },

  utilities: {
    marginTop: 40,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  utilitiesItem: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '25%',
    alignItems: 'center'
  },
  iconBackground: {
    backgroundColor: Colors.light.backgroundIcon,
    borderRadius: 100,
    width: '50%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textUtil: {
    fontSize: 12
  },
});
