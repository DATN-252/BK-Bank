import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { ImageBackground } from 'expo-image';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ConfirmDataType {
    zipCode: string,
    amount: number,
    fee: number,
    cardType: string,
    bankName: string,
    maskedCardNumber: string,
    merchantName: string,
    executionTime: string,
    totalAmount: number,
    cardNetwork: string,
    merchantId: string,
    recipientAccount: string,
    cardholderName: string,
    recipientName: string,
    currency: string,
    billingAddress: string,
    status: string
};

const DISPLAY_FIELDS: [keyof ConfirmDataType, string][] = [
    ['amount', 'Số tiền'],
    ['merchantName', 'Tên bên nhận'],
    ['merchantId', 'Tài khoản bên nhận'],
    ['bankName', 'Ngân hàng'],
    ['executionTime', 'Thời gian thực hiện'],
    ['fee', 'Phí giao dịch'],
    ['totalAmount', 'Tổng cộng'],
];

export default function ConfirmTransactionScreen() {
    const router: Router = useRouter();
    let { confirmData } = useLocalSearchParams<{ confirmData: string }>();
    const responseData = confirmData ? JSON.parse(confirmData) : null;

    // Hàm render từng dòng key:value, space-between
    // const responseData =  {
    //     "zipCode": "100000",
    //     "amount": 90.0,
    //     "fee": 0,
    //     "cardType": "CREDIT",
    //     "bankName": "BKBank Merchant Network",
    //     "maskedCardNumber": "**** **** **** 1111",
    //     "merchantName": "Điện lực EVN",
    //     "executionTime": "2026-03-19 21:18:24",
    //     "totalAmount": 90.0,
    //     "cardNetwork": "VISA",
    //     "merchantId": "SP0001",
    //     "recipientAccount": "SP0001",
    //     "cardholderName": "Nguyen Van A",
    //     "recipientName": "Điện lực EVN",
    //     "currency": "VND",
    //     "billingAddress": "123 A Street, Hanoi",
    //     "status": "VALID"
    // };
    const renderKeyValueRows = (data: ConfirmDataType) => {
        return DISPLAY_FIELDS.map(([key, label], idx) => (
            <ThemedView
                key={idx}
                style={{
                    flex: (Object.keys(DISPLAY_FIELDS).length - idx === 3) ? 1 : 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                <ThemedText style={styles.bodyText}>{label}</ThemedText>
                <ThemedText style={[styles.bodyText, { fontWeight: 'bold' }]}>
                    {String(data[key])}  {idx === 0
                        || idx === Object.keys(DISPLAY_FIELDS).length - 1
                        || idx === Object.keys(DISPLAY_FIELDS).length - 2 ? data.currency : ''}
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
                    <ThemedText style={styles.headerText}>Xác nhận chuyển tiền</ThemedText>
                </ThemedView>

                <ThemedView style={styles.body}>
                    <ThemedView style={{ flex: 1, width: '90%', marginBottom: 24, gap: '4%' }}>
                        {renderKeyValueRows(responseData)}
                    </ThemedView>

                </ThemedView>

                <ThemedView style={styles.footer}>
                    <TouchableOpacity
                        style={styles.buttonFooter}
                        onPress={() => {
                            const {
                                zipCode,
                                fee,
                                totalAmount,
                                bankName,
                                maskedCardNumber,
                                merchantName,
                                executionTime,
                                cardNetwork,
                                recipientAccount,
                                cardholderName,
                                recipientName,
                                currency,
                                billingAddress,
                                status, ...dataToSend } = responseData;

                            dataToSend.amount = responseData.totalAmount;
                            console.log('Data for execution: ', dataToSend);
                            router.replace({
                                pathname: '/transaction/loading',
                                params: {
                                    dataToSend: JSON.stringify({
                                        ...dataToSend,
                                    }),
                                },
                            });
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