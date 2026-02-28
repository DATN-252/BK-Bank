import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, ImageBackground } from 'expo-image';
import { Router, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import { BackgroundView } from '@/components/background-view';



export default function TransactionScreen() {
    // Dữ liệu hiển thị theo ảnh mẫu
    const responseData = [
        { key: 'Số tiền', value: '1.234.567 VND' },
        { key: 'Thông tin chi tiết', value: 'Vietcombank\n********6789', isMultiline: true },
        { key: 'Lời nhắn', value: 'Nguyen Van A chuyen tien' },
        { key: 'Ngày thực hiện', value: '20/12/2025 19:20:18' },
        { key: 'Mã giao dịch', value: '123456789ABC' },
    ];
    const router: Router = useRouter();

    const viewRef = useRef<ViewShot>(null);
    const captureScreen = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") return;

            if (viewRef.current && viewRef.current.capture) {
                const uri = await viewRef.current.capture();
                if (uri) await MediaLibrary.saveToLibraryAsync(uri);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Render từng dòng key:value, hỗ trợ multiline cho value
    const renderKeyValueRows = (data: Array<{ key: string, value: string, isMultiline?: boolean }>) => {
        return data.map((item, idx) => (
            <ThemedView
                key={idx}
                style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 8 }}
            >
                <ThemedText style={styles.bodyText}>{item.key}</ThemedText>
                <ThemedText
                    style={[styles.bodyText, { fontWeight: 'bold', textAlign: 'right' }]}
                    numberOfLines={item.isMultiline ? 2 : 1}
                >
                    {item.value}
                </ThemedText>
            </ThemedView>
        ));
    };

    return (
        <ThemedView style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/background-receipt.png')}
                style={styles.content}
                contentFit="fill"
            >
                <ThemedView style={styles.header}>
                    <FontAwesome name="check-circle" size={64} color="green" />
                    {/* <FontAwesome name="times-circle" size={24} color="black" /> */}
                    <ThemedText style={styles.headerText}>Chuyển khoản thành công</ThemedText>
                </ThemedView>

                <ThemedView style={styles.body}>
                    {renderKeyValueRows(responseData)}
                </ThemedView>

                <ThemedView style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.buttonFooter, { backgroundColor: Colors.light.tabIconSelected, }]}
                        onPress={captureScreen}
                    >
                        <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Chụp màn hình</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonFooter, { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.light.tabIconSelected, }]}
                        onPress={() => router.replace('/transaction')}
                    >
                        <ThemedText style={{ color: Colors.light.tabIconSelected, fontWeight: 'bold' }}>Giao dịch mới</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ImageBackground>

            {/* ===== LAYOUT ẨN (Chỉ dùng để capture) ===== */}
            <ViewShot
                ref={viewRef}
                options={{ format: "png", quality: 1 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: 0
                }}
            >
                <BackgroundView>
                    <ThemedView style={styles.container}>
                        <Image
                            source={require('@/assets/images/logo-bank.png')}
                            style={{ width: 140, height: 100, resizeMode: 'contain', alignSelf: 'center' }}
                        />

                        <ImageBackground
                            source={require('@/assets/images/background-receipt.png')}
                            style={styles.content}
                            contentFit="fill"
                        >
                            <ThemedView style={styles.header}>
                                <FontAwesome name="check-circle" size={64} color="green" />
                                <ThemedText style={styles.headerText}>
                                    Chuyển khoản thành công
                                </ThemedText>
                            </ThemedView>

                            <ThemedView style={styles.body}>
                                {renderKeyValueRows(responseData)}
                            </ThemedView>
                        </ImageBackground>
                    </ThemedView>
                </BackgroundView>
            </ViewShot>
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
        width: '95%',
        height: '90%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    header: {
        flex: 3,
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
        flex: 7,
        width: '80%',
        alignItems: 'center',
        gap: '2%',
    },

    bodyText: {
        fontSize: 16,
        color: Colors.light.tabIconDefault,
    },

    footer: {
        flex: 3,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        flexDirection: 'row',
        gap: '10%',
    },
    buttonFooter: {
        width: '40%',
        borderRadius: 5,
        backgroundColor: Colors.light.tabIconSelected,
        paddingVertical: '1.8%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});