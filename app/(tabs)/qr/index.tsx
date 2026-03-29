import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import CustomSwitch from '@/components/switch-animation';
import { Router, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';



type TLVObject = {
  [tag: string]: string;
};
const parseTLV = (str: string): TLVObject => {
  const result: TLVObject = {};
  let i = 0;

  while (i < str.length) {
    const tag = str.slice(i, i + 2);
    const length = parseInt(str.slice(i + 2, i + 4));
    const value = str.slice(i + 4, i + 4 + length);

    result[tag] = value;

    i += 4 + length;
  }

  return result;
};

export default function QRScreen() {
  const router: Router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState<boolean>(false);
  const [flash, setFlash] = React.useState<boolean>(false);
  const isFocused: boolean = useIsFocused();
  const labels: [string, string] = ['Mã QR của tôi', 'Quét mã QR'];
  const [scanned, setScanned] = React.useState<boolean>(false);
  const [dataQR, setDataQR] = React.useState<string>('');

  // chọn ảnh từ thư viện
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    // đang pick ảnh thì khóa lại
    setScanned(true);

    if (!result.canceled) {
      const results = await Camera.scanFromURLAsync(result.assets[0].uri, ["qr"]);
      if (!results[0]?.data) alert('Không tìm thấy mã QR trong ảnh. Vui lòng cắt ảnh rõ hơn hoặc thử lại!');
      else {
        // alert(`Dữ liệu mã QR: ${results[0].data}`);
        setDataQR(results[0].data);
      }
    }

    // het pick ảnh rồi thì mở khóa lại
    setScanned(false);
  };

  // kiểm tra mã QR có hợp lệ không (EMVCo)
  const isValidBankQR = (data: string) => {
    if (!data) return false;

    // Không cho ký tự đặc biệt
    // if (!/^[A-Za-z0-9 ]+$/.test(data)) return false;

    // Chuẩn EMVCo
    if (!data.startsWith('000201')) {
      return false;
    }

    // Quốc gia
    // if (!data.includes('5802VN')) return false;

    // CRC
    if (!data.includes('6304')) {
      return false;
    }

    return true;
  };

  // mở cài đặt để mở quyền
  const openSettings = () => {
    requestPermission();
    if (permission?.canAskAgain) return;
    Linking.openSettings();
  };

  React.useEffect(() => {
    // khi dataQR = ''
    if (!dataQR) return;

    // mở sau 3s
    setTimeout(() => {
      setScanned(false);
      setDataQR('');
    }, 3000);

    if (!isValidBankQR(dataQR)) {
      alert('Mã QR không hợp lệ, yêu cầu chuẩn EMVCo!');
      return;
    }

    // xử lý kết quả quét QR
    const obj = parseTLV(dataQR);
    const merchantInfo = parseTLV(obj["26"]);
    const additionalData = parseTLV(obj["62"]);

    const parsed = {
      payloadFormat: obj["00"],
      initiationMethod: obj["01"],
      merchantCategory: obj["52"],
      currency: obj["53"],
      amount: obj["54"],
      country: obj["58"],
      merchantName: obj["59"],
      merchantCity: obj["60"],
      merchantAccount: {
        GUI: merchantInfo["00"],
        merchantId: merchantInfo["01"],
      },
      location: {
        latitude: additionalData["50"],
        longitude: additionalData["51"]
      },
      crc: obj["63"]
    };

    //todo phải xử lý thêm nếu qr là về tk ngân hàng thì push('/transaction/debitCard')
    router.push({
      pathname: '/transaction',
      params: {
        qrData: JSON.stringify(parsed),
      },
    });
  }, [dataQR, router]);

  const handleMyQR = (value: boolean) => {
    if (value) {
      router.push('/qr/my-qr');
    }
  };

  // element wrapper
  const QRView = () => {
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
              <AntDesign name="left" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
            <ThemedText type='subtitle'>{labels[1]}</ThemedText>
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
              <Image source={require('@/assets/images/NAPAS.png')} style={styles.intermediaryLogo} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* qr frame */}
        <ThemedView style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
          <ThemedView style={[styles.statusBar, { flex: 1 }]}></ThemedView>
          <ThemedView style={styles.squareQRFrame}>
            {!permission || !permission.granted ?
              <ThemedView style={{ backgroundColor: Colors.light.tabIconDefault, flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <ThemedText type='subtitle'>Cần được cấp quyền Camera!</ThemedText>
                <TouchableOpacity style={{ backgroundColor: Colors.light.warning, padding: 5, borderRadius: 5 }} onPress={openSettings}>
                  <ThemedText type='subtitle'>Cấp quyền</ThemedText>
                </TouchableOpacity>
              </ThemedView>
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
          <ThemedView style={{ width: '70%', marginVertical: 20, backgroundColor: 'transparent' }}>
            {isFocused && <CustomSwitch
              labels={labels}
              onToggle={handleMyQR} />}
          </ThemedView>
        </ThemedView>
      </SafeAreaProvider >
    );
  };

  return (
    <>
      {isFocused && <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={({ data }) => {
          if (scanned) return;

          // tránh data rỗng thì khóa vĩnh viễn
          if (!data) {
            setScanned(true); // khóa lại
            setDataQR(data);
          }
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
    paddingHorizontal: '6%',
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
    marginTop: '-10%'
  },
  intermediaryLogo: {
    resizeMode: 'contain',
    width: '20%',
    height: 40
  },

  squareQRFrame: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    flex: 7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  controlCameraContainer: {
    marginVertical: '5%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-around'
  },
  controlCamera: {
    padding: '3%',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: Colors.light.icon,
    borderWidth: 2
  }
});
