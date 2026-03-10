import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { ImageBackground } from 'expo-image';
import { Router, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';



export default function ConfirmTransactionScreen() {
        // Hàm render từng dòng key:value, space-between
        const reponseData = [
            { key: 'Số tiền', value: '1.234.567 VND' },
            { key: 'Tên bên nhận', value: 'Nguyen Van A' },
            { key: 'Mã bên nhận', value: 'CTTVPN01' },
            { key: 'Ngân hàng', value: 'Master Card' },
            { key: 'Phí giao dịch', value: '0 VND' },
            { key: 'Tổng cộng', value: '1.000.000 VND' },
        ];
        const renderKeyValueRows = (data: Array<{ key: string, value: string }>) => {
            return data.map((item, idx) => (
                <ThemedView key={idx} 
                style={{flex: (data.length - idx == 3) ? 1 : 0,
                    flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <ThemedText style={styles.bodyText}>{item.key}</ThemedText>
                    <ThemedText style={[styles.bodyText, { fontWeight: 'bold' }]}>{item.value}</ThemedText>
                </ThemedView>
            ));
        };
    const router: Router = useRouter();


    return (
        <ThemedView style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/background-receipt.png')}
                style={styles.content}
                contentFit="fill"
            >
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.headerText}>Xác nhận chuyển tiền</ThemedText>
                </ThemedView>

                <ThemedView style={styles.body}>
                    <ThemedView style={{flex: 1, width: '90%', marginBottom: 24, gap: '4%' }}>
                        {renderKeyValueRows(reponseData)}
                    </ThemedView>
                   
                </ThemedView>

                <ThemedView style={styles.footer}>
                    <TouchableOpacity
                        style={styles.buttonFooter}
                        onPress={() => {
                            router.replace('/transaction/loading');
                        }}
                    >
                        <ThemedText>Tiếp tục</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ImageBackground>
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
        width: '95%',
        height: '95%',
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
        flex: 4,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
   
    bodyText: {
        fontSize: 16,
        color: Colors.light.tabIconDefault,
    },

    footer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingBottom: '5%',
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