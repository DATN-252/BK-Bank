import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import PayService from '@/service/payApi';
import { TransactionCreditType, TransactionPreviewCreditResponseType } from '@/types/payment';
import { ImageBackground } from 'expo-image';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LoadingScreen from './loading';



const DISPLAY_FIELDS: [keyof TransactionPreviewCreditResponseType, string][] = [
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
    const responseData: any = confirmData ? JSON.parse(confirmData) : null;
    const [loading, setLoading] = React.useState(false);

    const api = async (dataToSend: TransactionCreditType) => {
        try {
            const res = await PayService.paymentCredit(dataToSend);
            // console.log('Review Response:', res);

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
        } catch (err: any) {
            // console.log(err.toJSON?.() || err);
            if (err?.response?.status === 401) {
                alert(err?.response?.data?.message || 'Uỷ quyền đã hết hạn. Vui lòng đăng nhập lại.');
            } else if (err?.response?.status === 400
                && err?.response?.data?.result.errorCode === 'SUSPECTED_FRAUD') {
                router.replace({
                    pathname: '/transaction/error',
                    params: { checkoutData: JSON.stringify(err?.response?.data?.result) },
                });
            }
            else {
                // console.error('Lỗi khi thực hiện giao dịch (trang confirm): ', err);
                router.back();
                alert(err.response?.data?.message || 'Đã có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng thử lại sau.');
            }
        }
    };

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
    const renderKeyValueRows = (data: TransactionPreviewCreditResponseType) => {
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
        <>
            {loading ?
                <LoadingScreen />
                :
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
                                disabled={loading}
                                onPress={async () => {
                                    setLoading(true);

                                    const {
                                        zipCode,
                                        fee,
                                        totalAmount,
                                        bankName,
                                        maskedCardNumber,
                                        merchantName,
                                        executionTime,
                                        cardNetwork,
                                        merchantLongitude,
                                        merchantLatitude,
                                        merchantAddress,
                                        recipientAccount,
                                        cardholderName,
                                        recipientName,
                                        currency,
                                        billingAddress,
                                        status, ...dataToSend } = responseData;

                                    dataToSend.amount = responseData.totalAmount;
                                    await api(dataToSend);
                                    // console.log('Data for execution: ', dataToSend);
                                }}
                            >
                                <ThemedText>Xác nhận</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ImageBackground>
                </ThemedView>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
    },
    content: {
        width: '100%',
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
        paddingBottom: '4%',
    },
    buttonFooter: {
        width: '75%',
        borderRadius: 5,
        backgroundColor: Colors.light.tabIconSelected,
        paddingVertical: '1.5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});