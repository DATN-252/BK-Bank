import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import CustomSwitch from '@/components/switch-animation';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';


const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    console.log(result.assets[0].uri);
  }
};

export default function QRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState<boolean>(false);
  const [flash, setFlash] = React.useState<boolean>(false);
  const [isOn, setIsOn] = React.useState<boolean>(false);
  const isFocused = useIsFocused();

  const labels: [string, string] = ['Mã QR của tôi', 'Quét mã QR'];

  // element wrapper
  const QRView = (elements: { children?: React.ReactNode }) => {
    return (
      <SafeAreaProvider style={{ position: 'absolute', flex: 1, width: '100%', height: '100%' }}>
        {/* status */}
        <SafeAreaView
          edges={['top']}
          style={styles.statusBar}
        >
          <StatusBar style="light" />
        </SafeAreaView>

        {/* logo branch */}
        <ThemedView style={[styles.statusBar, { paddingVertical: '3%', height: '30%' }]}>
          <ThemedView style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="close" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
            <ThemedText type='subtitle'>Quét mã QR</ThemedText>
            <ThemedView>
              {/* cho cân :)) */}
            </ThemedView>
          </ThemedView>
          <ThemedView style={{ height: 1, backgroundColor: '#FFFFFF' }} />

          <ThemedView style={{ justifyContent: 'center', backgroundColor: 'transparent', height: '100%' }}>
            <ThemedView style={styles.intermediaryLogoContainer}>
              {/* //todo nếu cần load dynamic*/}
              <Image source={require('@/assets/images/256px-VietQR_Logo.svg.png')} style={styles.intermediaryLogo} />
              <Image source={require('@/assets/images/256px-Zalopay_horizontal_logo_2025.svg.png')} style={styles.intermediaryLogo} />
              <Image source={require('@/assets/images/napas.png')} style={styles.intermediaryLogo} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* qr frame */}
        <ThemedView style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
          <ThemedView style={[styles.statusBar, { flex: 1 }]}></ThemedView>
          <ThemedView style={styles.squareQRFrame}>
            {elements ?
              elements.children
              : null}
          </ThemedView>
          <ThemedView style={[styles.statusBar, { flex: 1 }]}></ThemedView>
        </ThemedView>

        {/* control camera */}
        <ThemedView style={[styles.statusBar, { flex: 1, alignItems: 'center' }]}>
          <ThemedText type='subtitle'>Giơ máy ảnh đối diện với mã QR</ThemedText>
          <ThemedView style={styles.controlCameraContainer}>
            <TouchableOpacity
              style={styles.controlCamera}
              onPress={() => setFacing((f) => !f)}
            >
              <AntDesign name="sync" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlCamera}
              onPress={() => setFlash((f) => !f)}
            >
              <AntDesign name="thunderbolt" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlCamera}
              onPress={pickImage}
            >
              <AntDesign name="file-image" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* my/scan qr */}
        <ThemedView style={[styles.statusBar, { flex: 1, alignItems: 'center' }]}>
          <ThemedView style={{ width: '70%', marginVertical: 20, backgroundColor: 'transparent' }}><CustomSwitch labels={labels} onToggle={setIsOn} /></ThemedView>
        </ThemedView>
      </SafeAreaProvider>
    );
  };

  if (!permission) return <ThemedView />;
  if (!permission.granted) {
    return (
      <QRView>
        <ThemedView style={{ backgroundColor: Colors.light.tabIconDefault, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <ThemedText type='subtitle'>Chưa có quyền camera</ThemedText>
          <Button color={Colors.light.warning} title="Cấp quyền" onPress={requestPermission} />
        </ThemedView>
      </QRView>
    );
  }

  return (
    <>
      {isFocused && <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={({ data }) => {
          console.log('QR DATA:', data);
        }}
        facing={facing ? 'front' : 'back'}
        flash={flash ? 'on' : 'off'}
      />}
      <QRView />
    </>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#000000aa',
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: '7%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  intermediaryLogoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    backgroundColor: 'transparent',
    marginTop: -30
  },
  intermediaryLogo: {
    resizeMode: 'contain',
    width: 80,
    height: 40
  },

  squareQRFrame: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    flex: 5,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  controlCameraContainer: {
    marginVertical: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-around'
  },
  controlCamera: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: Colors.light.icon,
    borderWidth: 2
  }
});
