
import React from 'react';
import { TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import CustService from '@/service/custApi';
import { termStatementType } from '@/types/statement';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Dropdown } from 'react-native-element-dropdown';
import { Router, useRouter } from 'expo-router';

import { useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/build/AntDesign';



export default function StatementScreen() {
    const router: Router = useRouter();
    const [selectedLoanId, setSelectedLoanId] = React.useState<string | null>(null);
    const [statements, setStatements] = React.useState<termStatementType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const loanAccounts = useSelector((state: ReduxTypes['RootState']) => state.loanAcc);
    const loanOptions = loanAccounts.map((loan) => ({
        label: `${loan.accountNumber}`,
        value: `${loan.accountNumber}`,
    }));

    //! Lấy danh sách sao kê, api bị disable nên tạm comment
    // React.useEffect(() => {
    //     (async () => {
    //         setLoading(true);
    //         try {
    //             const res = await CustService.getAllTermStatements();
    //             setStatements(Array.isArray(res.result) ? res.result : []);
    //         } catch (err) {
    //             // console.error('Error fetching statements:', err);
    //             setStatements([]);
    //         }
    //         setLoading(false);
    //     })();
    // }, []);

    const handleSelectLoanId = (loanId: string) => {
        setSelectedLoanId(loanId);

        (async () => {
            setLoading(true);
            try {
                const res = await CustService.getAllTermStatementsbyLoanId(loanId);
                setStatements(Array.isArray(res.result) ? res.result : []);
            } catch (err) {
                // console.error('Error fetching statements:', err);
                setStatements([]);
            }
            setLoading(false);
        })();
    };

    const handleSelectTerm = (loanId: string, billingDate: string) => {
        // gọi api
        (async () => {
            setLoading(true);
            try {
                const res = await CustService.getStatementsbyLoanIdAndBillingDate(loanId, billingDate);
                // console.log('Statement detail:', res.result);

                router.push({
                    pathname: '/utilities/utilCard/statement/statementDetail',
                    params: {
                        statementData: JSON.stringify(res.result) // truyền dữ liệu sao kê chi tiết dưới dạng chuỗi JSON
                    }
                });
            } catch (err: any) {
                if (err?.response?.status === 401) {
                    alert(err?.response?.data?.message || 'Uỷ quyền đã hết hạn. Vui lòng đăng nhập lại.');
                } else if (err?.response?.status === 400) {
                    alert(err?.response?.data?.message || 'Kỳ hạn chưa kết thúc!'); 
                } else if (!err?.response) {
                    alert('Không kết nối được server');
                } else {
                    alert('Lỗi khi lấy dữ liệu sao kê');
                    // console.log('Error in ccPayment:', err);
                }
            };
            setLoading(false);
        })();
    };

    const renderItem = ({ item }: { item: termStatementType }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleSelectTerm(item.accountNumber, item.billingDate)}
        >
            <ThemedText style={styles.itemText}>
                Sao kê kỳ hạn {item.statementPeriodStart} - {item.statementPeriodEnd}
            </ThemedText>
            <AntDesign name="right" size={14} color={Colors.light.icon} />
        </TouchableOpacity>
    );

    // Lọc statements theo search
    const filteredStatements = React.useMemo(() => {
        if (!search.trim()) return statements;
        const lower = search.toLowerCase();
        return statements.filter(item =>
            item.accountNumber?.toLowerCase().includes(lower) ||
            item.statementPeriodStart?.toLowerCase().includes(lower) ||
            item.statementPeriodEnd?.toLowerCase().includes(lower) ||
            item.billingDate?.toLowerCase().includes(lower)
        );
    }, [search, statements]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.dropdownContainer}>
                <ThemedText type='defaultSemiBold'>Chọn tài khoản tín dụng</ThemedText>
                <Dropdown
                    data={loanOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="-- Chọn --"
                    iconStyle={{ tintColor: Colors.light.icon }}
                    search
                    searchPlaceholder="Tìm kiếm..."
                    placeholderStyle={{ color: Colors.light.text }}
                    selectedTextStyle={{ color: Colors.light.text }}
                    value={selectedLoanId}
                    onChange={(item) => handleSelectLoanId(item.value)}
                    style={styles.dropdown}
                />
            </ThemedView>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.light.icon} />
            ) : (
                <>
                    <View style={styles.rowSearchTitle}>
                        <ThemedText type='defaultSemiBold' style={styles.listTitle}>Các kỳ hạn gần đây</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder='Tìm kiếm kỳ hạn'
                            placeholderTextColor={Colors.light.text}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <FlatList
                        data={filteredStatements}
                        keyExtractor={(item) => item.statementId.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<ThemedText style={styles.emptyText}>Không có sao kê</ThemedText>}
                    />
                </>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 16
    },

    dropdownContainer: {
        backgroundColor: 'transparent',
        marginBottom: 24
    },
    dropdownLabel: {
        marginRight: 8,
        fontWeight: 'bold'
    },
    dropdown: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.light.borderColor,
        padding: 8,
        borderRadius: 10,
        color: Colors.light.text,
        backgroundColor: Colors.light.backgroundIcon
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.light.borderColor,
        borderRadius: 10,
        marginBottom: 16,
    },
    itemText: {
        flex: 1,
        fontSize: 16
    },
    arrow: {
        fontSize: 20,
        color: '#888'
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
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
    },
});