import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Router, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import CustService from '@/service/custApi';
import { setSavingAccount } from '@/redux/reducerSavingAcc';
import { setLoanAccount } from '@/redux/reducerLoanAcc';
import { useDispatch } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';



export default function TransactionScreen() {
    const router: Router = useRouter();

    // get account loan + saving
    const dispatch: ReduxTypes['AppDispatch'] = useDispatch();
    React.useEffect(() => {
        (async () => {
            try {
                const loanData = await CustService.getInfoLoan();
                const savingData = await CustService.getInfoSaving();
                dispatch(setLoanAccount(loanData.result.content));
                dispatch(setSavingAccount(savingData.result.content));
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        })();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.headerText}>Chọn dịch vụ về thẻ</ThemedText>
                </ThemedView>

                <ThemedView style={styles.body}>
                    <TouchableOpacity style={styles.item} onPress={() => router.push('/utilities/utilCard/ccPayment')}>
                        <Image source={require('@/assets/images/icon-bank.png')} style={styles.icon} />
                        <ThemedText style={styles.bodyText}>Trả nợ thẻ tín dụng</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => router.push('/utilities/utilCard/lockCard')}>
                        <Image source={require('@/assets/images/icon-debitcard.png')} style={styles.icon} />
                        <ThemedText style={styles.bodyText}>Khóa/Mở khóa thẻ</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => router.push('/future')}>
                        <Image source={require('@/assets/images/icon-statement.png')} style={styles.icon} />
                        <ThemedText style={styles.bodyText}>Sao kê giao dịch</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/future')}
                    >
                        <Image source={require('@/assets/images/icon-creditcard.png')} style={styles.icon} />
                        <ThemedView>
                            <ThemedText style={styles.bodyText}>Mở thẻ mới</ThemedText>
                            <ThemedView style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', width: '90%' }}>
                                <Image source={require('@/assets/images/MASTERCARD.png')} style={styles.miniIcon} />
                                <Image source={require('@/assets/images/VISA.png')} style={styles.miniIcon} />
                                <Image source={require('@/assets/images/JCB.png')} style={styles.miniIcon} />
                                <Image source={require('@/assets/images/AMEX.png')} style={styles.miniIcon} />
                            </ThemedView>
                        </ThemedView>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
    },
    content: {
        width: '90%',
        height: '90%',
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