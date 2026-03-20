import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import PayService from '@/service/payApi';


export default function LoadingScreen() {
    const router: Router = useRouter();
    let { dataToSend } = useLocalSearchParams<{ dataToSend: string }>();
    const responseData = dataToSend ? JSON.parse(dataToSend) : null;

    React.useEffect(() => {
        const callApi = async () => {
            try {
                const res = await PayService.paymentCredit(responseData);
                console.log('Review Response:', res);

                if (res.result.approved) {
                    router.replace({
                        pathname: '/transaction/success',
                        params: { checkoutData: JSON.stringify(res.result) },
                    });
                } else {
                    router.replace({
                        pathname: '/transaction/error',
                        params: { checkoutData: JSON.stringify(res.result) },
                    });
                }
            } catch (err) {
                router.back();
                alert('Có lỗi xảy ra khi thực hiện giao dịch. Vui lòng thử lại sau.');
            }
        };

        callApi();
    }, []);


    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.headerText}>Đang xử lý giao dịch</ThemedText>
                </ThemedView>

                <ThemedView style={styles.body}>
                    <Ionicons name="hourglass-outline" size={240} color="black" />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '90%',
        height: '60%',
        backgroundColor: Colors.light.text,
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
        flex: 10,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
    },
    item: {
        width: '100%',
        height: '16%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderColor: Colors.light.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: '5%',
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    miniIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    bodyText: {
        fontSize: 16,
        color: Colors.light.tabIconDefault,
    },
});