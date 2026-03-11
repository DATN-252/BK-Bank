import { BackgroundView } from '@/components/background-view';
import QRCode from 'react-native-qrcode-svg';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '@/constants/Colors';
import { Router, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import CustomSwitch from '@/components/switch-animation';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';



export default function TransactionScreen() {
    const router: Router = useRouter();
    const labels: [string, string] = ['Mã QR của tôi', 'Quét mã QR'];

    // tạo mã QR mẫu
    // const qrString = generateVietQR({
    //   bankCode: 'BIDV',
    //   accountNumber: '6361663166',
    //   accountName: 'NGUYEN HUY HOANG',
    //   amount: 50000,                // optional
    //   description: 'Thanh toan don hang #12345', // optional
    // });
    const qrStringDefault: string = '00020101021138540010A00000072701240006970418011063616631660208QRIBFTTA53037045802VN630485BC';

    const encodeTLV = (tag: string, value: string) => {
        const length = value.length.toString().padStart(2, "0");
        return tag + length + value;
    };
    const crc16 = (str: string) => {
        let crc = 0xFFFF;

        for (let c = 0; c < str.length; c++) {
            crc ^= str.charCodeAt(c) << 8;
            for (let i = 0; i < 8; i++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
                crc &= 0xffff;
            }
        }

        return crc.toString(16).toUpperCase().padStart(4, "0");
    }

    // EMVCo spec: https://www.emvco.com/knowledge-hub/emv-qr-code-for-payments/
    const merchantAccount =
        encodeTLV("00", "A0000000031010") + // globally unique identifier
        encodeTLV("01", "VNM_123");         // merchant id
    const indexMerchant =
        encodeTLV("50", "1") +        // latitude
        encodeTLV("51", "1");         // longitude
    const payload =
        encodeTLV("00", "01") +            // payload format indicator
        encodeTLV("01", "12") +            // point of initiation method (static QR code)
        encodeTLV("26", merchantAccount) +
        encodeTLV("52", "5411") +      // merchant category
        encodeTLV("53", "840") +       // currency
        encodeTLV("54", "100.00") +    // amount
        encodeTLV("58", "US") +        // country code
        encodeTLV("59", "Apple_STORE") + // merchant name
        encodeTLV("60", "NEW_YORK") +    // merchant city
        encodeTLV("62", indexMerchant)+  // additional data field template
        "6304";
    const qrString = payload + crc16(payload);
    
    const handleMyQR = (value: boolean) => {
        if (!value) {
            router.back();
        }
    };

    return (
        <BackgroundView>
            {/* logo branch */}
            <ThemedView style={[styles.statusBar, { paddingVertical: '3%', height: '30%' }]}>
                <ThemedView style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="left" size={24} color={Colors.light.icon} />
                    </TouchableOpacity>
                    <ThemedText type='subtitle'>{labels[0]}</ThemedText>
                    <TouchableOpacity onPress={() => router.replace('/home')}>
                        <FontAwesome name="home" size={24} color={Colors.light.icon} />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView style={{ height: 1, backgroundColor: '#FFFFFF' }} />

                <ThemedView style={{ justifyContent: 'center', backgroundColor: 'transparent', height: '100%' }}>
                    <ThemedView style={styles.intermediaryLogoContainer}>
                        {/* //todo nếu cần load dynamic*/}
                        <Image source={require('@/assets/images/logo-bank.png')} style={styles.intermediaryLogo} />
                        <ThemedText>Ngân hàng BK Bank chất lượng số 1 Việt Nam</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            {/* qr frame */}
            <ThemedView style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                <ThemedView style={[styles.statusBar, { flex: 1 }]}></ThemedView>
                <ThemedView style={styles.squareQRFrame}>
                    <QRCode
                        value={qrString}
                        size={260}
                    />
                </ThemedView>
                <ThemedView style={[styles.statusBar, { flex: 1 }]}></ThemedView>
            </ThemedView>

            {/* //todo maybe là sửa qr theo mức tiền và nội dung */}
            <ThemedView style={[styles.statusBar, { flex: 1, alignItems: 'center' }]}></ThemedView>

            {/* my/scan qr */}
            <ThemedView style={[styles.statusBar, { flex: 1, alignItems: 'center' }]}>
                <ThemedView style={{ width: '70%', marginVertical: 20, backgroundColor: 'transparent' }}>
                    <CustomSwitch
                        labels={labels}
                        initialState={true}
                        onToggle={handleMyQR} />
                </ThemedView>
            </ThemedView>

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

    intermediaryLogoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    intermediaryLogo: {
        resizeMode: 'contain',
        width: '30%',
        height: 70
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

});