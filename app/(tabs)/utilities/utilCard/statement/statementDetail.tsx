import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { statementDetailType, transactionStatementType } from '@/types/statement';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, View } from 'react-native';



export default function StatementDetailScreen() {
    const { statementData } = useLocalSearchParams<{ statementData: string }>();
    const [search, setSearch] = React.useState('');
    const statement: statementDetailType | null = React.useMemo(() => {
        try {
            return JSON.parse(statementData);
        } catch (error) {
            // console.error('Error parsing statement data:', error);
            return null;
        }
    }, [statementData]);

    // items có thể là mảng hoặc undefined/null
    const filteredTransactions = React.useMemo(() => {
        const transactions = Array.isArray(statement?.items)
            ? statement.items
            : [];

        if (!search.trim()) return transactions;

        const lower = search.toLowerCase();

        return transactions.filter(item =>
            item.merchantName?.toLowerCase().includes(lower) ||
            item.merchantId?.toLowerCase().includes(lower) ||
            item.transactionType?.toLowerCase().includes(lower) ||
            item.status?.toLowerCase().includes(lower) ||
            item.transactionDate?.toLowerCase().includes(lower)
        );
    }, [statement?.items, search]);

    if (!statement) {
        return (
            <ThemedView style={styles.centered}><ThemedText>Không có dữ liệu sao kê.</ThemedText></ThemedView>
        );
    };

    // Rectangle info box for termStatementType
    const currency = statement.currency || 'USD'; // Fallback nếu currency không có
    const InfoBox = () => (
        <ThemedView style={styles.infoBox}>
            <ThemedText type='subtitle' style={styles.infoTitle}>Chi tiết kỳ hạn #{statement.statementId}</ThemedText>
            <ThemedText style={styles.textKey}>Tài khoản: <ThemedText style={styles.textValue}>{statement.accountNumber}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Kỳ sao kê: <ThemedText style={styles.textValue}>{statement.statementPeriodStart} đến {statement.statementPeriodEnd}</ThemedText></ThemedText>
            {/* <ThemedText style={styles.textKey}>Ngày lập: <ThemedText style={styles.textValue}>{new Date(statement.generatedAt).toISOString().split('T')[0]}</ThemedText></ThemedText> */}
            <ThemedText style={styles.textKey}>Hạn thanh toán: <ThemedText style={styles.textValue}>{new Date(statement.dueDate).toISOString().split('T')[0]}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Trạng thái: <ThemedText style={[styles.textValue, { color: statement.statementStatus === 'PAID' ? '#00D26A' : statement.statementStatus === 'OVERDUE' ? 'red' : '#FFA500' }]}>{statement.statementStatus}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Số nợ kỳ trước: <ThemedText style={styles.textValue}>{statement.previousBalance.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Phát sinh trong kỳ: <ThemedText style={styles.textValue}>{statement.totalCharges.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Đã thanh toán: <ThemedText style={styles.textValue}>{statement.totalPayments.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Dư nợ mới: <ThemedText style={styles.textValue}>{statement.newBalance.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Đã trả sau sao kê: <ThemedText style={styles.textValue}>{statement.paidAmountAfterStatement.toLocaleString()} {currency}</ThemedText></ThemedText>

            <ThemedText style={styles.textKey}>Còn nợ: <ThemedText style={styles.textValue}>{statement.remainingBalance.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Tối thiểu phải trả: <ThemedText style={styles.textValue}>{statement.minimumDue.toLocaleString()} {currency} (tối thiểu {statement.minimumPaymentRate.toLocaleString()} {currency})</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Còn phải trả tối thiểu: <ThemedText style={styles.textValue}>{statement.remainingMinimumDue.toLocaleString()} {currency}</ThemedText></ThemedText>

            <ThemedText style={styles.textKey}>Lãi suất: <ThemedText style={styles.textValue}>{statement.interestRateAnnual.toLocaleString()}%/năm</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Phí phạt: <ThemedText style={styles.textValue}>{statement.lateFeeRate.toLocaleString()}% (tối thiểu {statement.lateFeeFixed.toLocaleString()} {currency})</ThemedText></ThemedText>

            <ThemedText style={styles.textKey}>Lãi tạm tính: <ThemedText style={styles.textValue}>{statement.interestCharged.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Phí phạt tạm tính: <ThemedText style={styles.textValue}>{statement.lateFeeCharged.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Đủ điều khiện miễn lãi: <ThemedText style={styles.textValue}>{statement.gracePeriodEligible ? 'Có' : 'Không'}</ThemedText></ThemedText>

            <ThemedText style={styles.textKey}>Số dư khả dụng: <ThemedText style={styles.textValue}>{statement.availableCredit.toLocaleString()} {currency}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Số giao dịch: <ThemedText style={styles.textValue}>{statement.transactionCount}</ThemedText></ThemedText>
            <ThemedText style={styles.textKey}>Hạn mức: <ThemedText style={styles.textValue}>{statement.creditLimit.toLocaleString()} {currency}</ThemedText></ThemedText>
        </ThemedView>
    );

    // Render item for FlatList
    const renderTransaction = ({ item }: { item: transactionStatementType }) => {
        // Icon và màu sắc dựa vào transactionType và status
        let icon = 'swap-horizontal';
        let iconColor = Colors.light.icon;
        let amountColor = '#000';
        let prefix = '';
        if (item.status !== 'SUCCESS') {
            icon = 'alert';
            iconColor = 'red';
            amountColor = 'red';
        } else if (item.transactionType === 'CHARGE') {
            icon = 'arrow-down';
            iconColor = 'red';
            amountColor = 'red';
            prefix = '-';
        } else if (item.transactionType === 'PAYMENT' || item.transactionType === 'REFUND') {
            icon = 'arrow-up';
            iconColor = '#00D26A';
            amountColor = '#00D26A';
            prefix = '+';
        } else if (item.transactionType === 'REVERSAL') {
            icon = 'refresh';
            iconColor = Colors.light.tint;
            amountColor = Colors.light.tint;
        }
        return (
            <ThemedView style={styles.row}>
                <ThemedView style={styles.iconBox}>
                    <Ionicons name={icon as any} size={24} color={iconColor} />
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                    <ThemedText style={styles.textKey}>Loại: <ThemedText style={styles.textValue}>{item.transactionType}</ThemedText></ThemedText>
                    <ThemedText style={styles.textKey}>Bên nhận: 
                        <ThemedText style={styles.textValue}>
                        {item.transactionType === 'PAYMENT' ?
                            statement.accountNumber
                            : item.merchantName + ' (' + item.merchantId + ')'}
                        </ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.textKey}>Dư nợ sau GD: <ThemedText style={styles.textValue}>{item.balanceAfter.toLocaleString()} {currency}</ThemedText></ThemedText>
                    <ThemedText style={styles.textKey}>Trạng thái: <ThemedText style={[styles.textValue, { color: item.status === 'SUCCESS' ? '#00D26A' : 'red' }]}>{item.status}</ThemedText></ThemedText>
                    <ThemedText style={styles.textKey}>Phản hồi: <ThemedText style={styles.textValue}>{item.responseMessage}</ThemedText></ThemedText>
                    <ThemedText style={styles.textKey}>{new Date(item.transactionDate).toISOString().split('T')[0]}</ThemedText>
                </ThemedView>
                <ThemedText style={[styles.amount, { color: amountColor }]}>{prefix}{item.amount.toLocaleString()} {currency}</ThemedText>
            </ThemedView>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <InfoBox />
            <View style={styles.rowSearchTitle}>
                <ThemedText type='defaultSemiBold' style={styles.listTitle}>Sao kê giao dịch</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder='Tìm kiếm giao dịch'
                    placeholderTextColor={Colors.light.text}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <FlatList
                data={filteredTransactions}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={renderTransaction}
                scrollEnabled={false}
                ListEmptyComponent={<ThemedText style={styles.emptyList}>Không có giao dịch.</ThemedText>}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
        color: 'black',
    },
    rowSearchTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    listTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    input: {
        flex: 1,
        fontSize: 15,
        backgroundColor: Colors.light.backgroundIcon,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 36,
        marginLeft: 8,
        color: Colors.light.text,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.icon,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textKey: {
        fontSize: 12,
        color: '#000000',
    },
    textValue: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000000',
    },
    amount: {
        fontWeight: 'bold',
        fontSize: 15,
        minWidth: 110,
        textAlign: 'right',
    },
    emptyList: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});