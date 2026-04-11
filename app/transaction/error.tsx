import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { CheckoutTransaction } from './success';
import { CheckoutErrorDataType } from '@/types/payment';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';


type DisplayField<T> = [
    keyof T,
    string,
    { isMultiline?: boolean }?
];

const fields: DisplayField<CheckoutErrorDataType>[] = [
    ['totalAmount', 'Số tiền', { isMultiline: true }],
    ['merchantName', 'Tên bên nhận', { isMultiline: true }],
    ['merchantId', 'Tài khoản bên nhận', { isMultiline: true }],
    ['bankName', 'Ngân hàng', { isMultiline: true }],
    ['transactionId', 'Mã giao dịch', { isMultiline: true }],
    ['transactionTime', 'Thời gian thực hiện', { isMultiline: true }],
    ['errorCode', 'Mã lỗi', { isMultiline: true }],
    ['errorTitle', 'Lý do từ chối', { isMultiline: true }]
];

// Render từng dòng key:value, hỗ trợ multiline cho value
const renderKeyValueRows = <T extends object>(
    data: T,
    fields: DisplayField<T>[]
) => {
    return fields.map(([key, label, options], idx) => (
        <ThemedView
            key={idx}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-start',
                marginBottom: 8,
            }}
        >
            <ThemedText style={styles.bodyText}>{label}</ThemedText>

            <ThemedText
                style={[styles.bodyText, { fontWeight: 'bold', textAlign: 'right' }]}
                numberOfLines={options?.isMultiline ? 2 : 1}
            >
                {String(data[key] ?? '')}
                {key === 'totalAmount' && (data as any).currency
                    ? ` ${(data as any).currency}`
                    : ''}
            </ThemedText>
        </ThemedView>
    ));
};

export default function ErrorTransactionScreen() {
    let { checkoutData } = useLocalSearchParams<{ checkoutData: string }>();
    const responseData = checkoutData ? JSON.parse(checkoutData) : null;

    return (
        <ThemedView style={styles.container}>
            <CheckoutTransaction
                title="Chuyển khoản thất bại"
                renderKeyValueRows={renderKeyValueRows(responseData, fields)}
                icon={{ name: 'times-circle', color: 'red' }}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
    },

    bodyText: {
        fontSize: 16,
        color: Colors.light.tabIconDefault,
    },
});