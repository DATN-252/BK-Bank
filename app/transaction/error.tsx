import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { CheckoutTransaction } from './success';



export default function ErrorTransactionScreen() {
    let { checkoutData } = useLocalSearchParams<{ checkoutData: string }>();
    const responseData = checkoutData ? JSON.parse(checkoutData) : null;

    return (
        <ThemedView style={styles.container}>
            <CheckoutTransaction
                title="Chuyển khoản thất bại"
                responseData={responseData}
                icon={{ name: 'time-circle', color: 'red' }}
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
});