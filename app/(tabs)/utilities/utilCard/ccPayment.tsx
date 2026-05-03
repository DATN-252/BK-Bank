import { Router, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import custApi from '@/service/custApi';
import { termStatementType } from '@/types/statement';

import { useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import LoadingScreen from '@/app/transaction/loading';



type CCPaymentForm = {
    paymentOption: string;
    amount?: number;
    paymentSource: string;
    sourceAccountNumber?: string;
    note?: string;
    loanId?: string;
};

const sourcePaymentOptions = [
    // { label: 'Tài khoản tiết kiệm', value: 'INTERNAL_SAVINGS_TERM' },
    // { label: 'Thu tiền tại quầy', value: 'CASH_COUNTER' },
    { label: 'Tài khoản ghi nợ', value: 'INTERNAL_SAVINGS' }
];

const paymentOptions = [
    { label: 'Thanh toán tối thiểu', value: 'MINIMUM_DUE' },
    { label: 'Thanh toán toàn bộ', value: 'STATEMENT_BALANCE' },
    { label: 'Thanh toán tùy chỉnh', value: 'CUSTOM' }
];

//hàm lấy dd-mm-yy hiện tại
const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
};

export default function CreditCardPaymentScreen() {
    const router: Router = useRouter();
    const [statement, setStatement] = React.useState<termStatementType>();

    // mặc định note là "Thanh toán trước hạn, ngày dd-mm-yy", nếu ngày hiện tại lớn hơn ngày đến hạn thì note sẽ là "Thanh toán trước hạn, ngày dd-mm-yy"
    const initialNote = `Thanh toan truoc han, ngay ${getCurrentDate()}`;
    const { control, watch, setValue, handleSubmit, formState: { errors }, reset } = useForm<CCPaymentForm>({
        defaultValues: {
            paymentSource: "INTERNAL_SAVINGS",
            paymentOption: "CUSTOM",
            amount: undefined,
            sourceAccountNumber: undefined,
            loanId: undefined,
            note: initialNote,
        }
    });
    const [loading, setLoading] = React.useState(false);

    const resetPaymentForm = React.useCallback(() => {
        reset({
            // paymentSource: "INTERNAL_SAVINGS",
            paymentOption: "CUSTOM",
            amount: undefined,
            // sourceAccountNumber: undefined,
            // loanId: undefined,
            note: initialNote,
        });
    }, [initialNote, reset]);

    // get info loan
    const loanAccounts = useSelector((state: ReduxTypes['RootState']) => state.loanAcc);
    const savingAccounts = useSelector((state: ReduxTypes['RootState']) => state.savingAcc);
    // tranform data để hiển thị lên dropdown
    const loanOptions = loanAccounts.map((loan) => ({
        label: `${loan.accountNumber}`,
        value: `${loan.accountNumber}`,
    }));
    const savingOptions = savingAccounts.map((saving) => ({
        label: `${saving.accountNumber}`,
        value: `${saving.accountNumber}`,
    }));

    const getCurrentStatement = async (loanId: string) => {
        try {
            const res: termStatementType[] = await custApi.getAllTermStatementsbyLoanId(loanId).then((res) => res.result);
            return res[0];
        } catch (err) {
            console.log('Error fetching current statement:', err);
            alert('Lỗi khi lấy thông tin khoản vay');
        }
    };

    // Update display amount when payment option or loan ID changes
    React.useEffect(() => {
        (async () => {
            // ktra loanid 
            if (!watch('loanId')) {
                alert('Vui lòng chọn tài khoản đích trước khi chọn loại thanh toán');

                // trả paymentOption về CUSTOM để người dùng nhập số tiền sau khi đã chọn loanId
                setValue('paymentOption', 'CUSTOM');
                return;
            };

            if (watch('paymentOption') === "MINIMUM_DUE") {
                if (!statement) alert('Thao tác quá nhanh. Vui lòng chọn lại!');
                setValue("amount", statement?.minimumDue ?? 0);
            } else if (watch('paymentOption') === "STATEMENT_BALANCE") {
                if (!statement) alert('Thao tác quá nhanh. Vui lòng chọn lại!');
                setValue("amount", statement?.newBalance ?? 0);
            } else if (watch('paymentOption') === "STATEMENT_BEFORE") {
                if (!statement) alert('Thao tác quá nhanh. Vui lòng chọn lại!');
                if (statement?.totalCharges === undefined || statement?.totalPayments === undefined)
                    return alert('Không thể lấy thông tin khoản nợ trước đó. Vui lòng chọn lại!');

                if (statement?.totalCharges >= statement?.totalPayments)
                    setValue("amount", statement?.previousBalance ?? 0);
                else
                    setValue("amount", statement?.newBalance ?? 0);

            };
        })();
    }, [watch('paymentOption')]);

    React.useEffect(() => {
        (async () => {
            // chọn loanId trước để lấy số nợ cần trả
            const selectedLoanId = watch('loanId');
            if (selectedLoanId) {
                setStatement(await getCurrentStatement(selectedLoanId));
            };

            // đổi note thành đúng hạn nếu ngày hiện tại đã vượt quá ngày đến hạn
            if (!statement) return;
            const dueDate = new Date(statement?.dueDate);
            const now = new Date();

            if (dueDate < now) {
                setValue('note', `Thanh toan dung han, ngay ${getCurrentDate()}`);
            }
        })();
    }, [watch('loanId')]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {loading ?
                <LoadingScreen />
                :
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.content}>

                        <ThemedView style={styles.header}>
                            <ThemedText style={styles.headerText}>Vui lòng điền đầy đủ thông tin</ThemedText>
                        </ThemedView>

                        <ThemedView style={styles.body}>
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps="handled"
                                extraScrollHeight={60}
                                enableOnAndroid={true}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8, paddingRight: 2 }} // lỗi gì đó mà input tràn ra ngoài scrollvỉew
                            >
                                <ThemedView>
                                    {/* {creditCardErrors.paymentSource ?
              <ThemedText style={styles.warning}>{creditCardErrors.paymentSource.message}</ThemedText>
              : 
            } */}
                                    <ThemedText style={styles.bodyText}>Loại tài khoản thanh toán nguồn</ThemedText>
                                    <Controller
                                        control={control}
                                        name="paymentSource"
                                        rules={{ required: '*Loại tài khoản nguồn là bắt buộc!' }}
                                        render={({ field: { onChange, value } }) => (
                                            <Dropdown
                                                data={sourcePaymentOptions}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="-- Chọn --"
                                                search
                                                searchPlaceholder="Tìm kiếm..."
                                                value={value}
                                                onChange={(item) => onChange(item.value)}
                                                style={{...styles.input, opacity: 0.6}}
                                                disable
                                            />
                                        )}
                                    />
                                </ThemedView>

                                <ThemedView>
                                    {/* {creditCardErrors.cardholderName ?
              <ThemedText style={styles.warning}>{creditCardErrors.cardholderName.message}</ThemedText>
              : 
            } */}
                                    <ThemedText style={styles.bodyText}>Tài khoản nguồn</ThemedText>
                                    <Controller
                                        rules={{ required: '*Tài khoản nguồn là bắt buộc!' }}
                                        control={control}
                                        name="sourceAccountNumber"
                                        render={({ field: { onChange, value } }) => (
                                            <Dropdown
                                                data={savingOptions}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="-- Chọn --"
                                                search
                                                searchPlaceholder="Tìm kiếm..."
                                                value={value ?? null}
                                                onChange={(item) => onChange(item.value)}
                                                style={styles.input}
                                            />
                                        )}
                                    />
                                </ThemedView>

                                <ThemedView>
                                    {/* {creditCardErrors.loanId ?
                              <ThemedText style={styles.warning}>{creditCardErrors.loanId.message}</ThemedText>
                              : 
                            } */}
                                    <ThemedText style={styles.bodyText}>Tài khoản đích</ThemedText>
                                    <Controller
                                        control={control}
                                        name="loanId"
                                        rules={{ required: '*Tài khoản đích là bắt buộc!' }}
                                        render={({ field: { onChange, value } }) => (
                                            <Dropdown
                                                data={loanOptions}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="-- Chọn --"
                                                search
                                                searchPlaceholder="Tìm kiếm..."
                                                value={value ?? null}
                                                onChange={(item) => onChange(item.value)}
                                                style={styles.input}
                                            />
                                        )}
                                    />
                                </ThemedView>

                                <ThemedView>
                                    <ThemedText style={styles.bodyText}>Loại thanh toán</ThemedText>
                                    <Controller
                                        control={control}
                                        name="paymentOption"
                                        rules={{ required: '*Loại thanh toán là bắt buộc!' }}
                                        render={({ field: { onChange, value } }) => (
                                            <Dropdown
                                                data={paymentOptions}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="-- Chọn --"
                                                search
                                                searchPlaceholder="Tìm kiếm..."
                                                value={value}
                                                onChange={(item) => onChange(item.value)}
                                                style={styles.input}
                                            />
                                        )}
                                    />
                                </ThemedView>

                                <ThemedView>
                                    <ThemedText style={styles.bodyText}>Số tiền</ThemedText>
                                    <Controller
                                        control={control}
                                        name="amount"
                                        rules={{ required: '*Số tiền là bắt buộc!' }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                value={value === undefined || value === null ? '' : String(value)}
                                                onChangeText={(text) => {
                                                    setValue('paymentOption', 'CUSTOM');
                                                    onChange(text === '' ? undefined : Number(text));
                                                }}
                                                placeholder="Nhập số tiền"
                                                keyboardType="numeric"
                                            />
                                        )}
                                    />
                                </ThemedView>

                                <ThemedView>
                                    {/* {creditCardErrors.note ?
              <ThemedText style={styles.warning}>{creditCardErrors.note.message}</ThemedText>
              : 
            } */}
                                    <ThemedText style={styles.bodyText}>Ghi chú</ThemedText>
                                    <Controller
                                        control={control}
                                        name="note"
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                value={value ?? initialNote}
                                                onChange={onChange}
                                                style={{...styles.input, opacity: 0.6}}
                                                editable={false}
                                            />
                                        )}
                                    />
                                </ThemedView>
                            </KeyboardAwareScrollView >
                        </ThemedView>

                        <ThemedView style={styles.footer}>
                            <TouchableOpacity
                                style={styles.buttonFooter}
                                disabled={loading}
                                onPress={handleSubmit(
                                    async (data) => {
                                        try {
                                            // console.log('Data ccPayment:', data);
                                            if (!statement) {
                                                alert('Vui lòng chọn tài khoản đích!');
                                                return;
                                            };

                                            if (!data.loanId) {
                                                alert('Thiếu tài khoản đích!');
                                                return;
                                            }

                                            // amount = 0
                                            if (data.amount === 0) {
                                                if (data.paymentOption === "STATEMENT_BEFORE")
                                                    alert('Đã thanh toán kỳ hạn trước. Vui lòng chọn loại thanh toán khác!');
                                                else
                                                    alert('Tài khoản không có khoản nợ nào để thanh toán!');
                                                resetPaymentForm();
                                                return;
                                            };

                                            setLoading(true);
                                            if (data.paymentOption === "STATEMENT_BEFORE")
                                                data.paymentOption = "CUSTOM";

                                            const res = await custApi.postCreditCardPayments(data.loanId, statement?.billingDate, data);
                                            if (res.resultCode !== '00') {
                                                router.replace({
                                                    pathname: '/utilities/utilCard/success',
                                                    params: { checkoutData: JSON.stringify(res.result) }
                                                });
                                            } else {
                                                //todo làm lại path, tạm thời như phía dưới do chưa biet kieu tra ve cua api nay
                                                router.replace({
                                                    pathname: '/transaction/error',
                                                    params: { checkoutData: JSON.stringify(res.result) }
                                                });
                                            };
                                            resetPaymentForm();
                                        } catch (err: any) {
                                            if (err?.response?.status === 401) {
                                                alert(err?.response?.data?.message || 'Uỷ quyền đã hết hạn. Vui lòng đăng nhập lại.');
                                            } else if (err?.response?.status === 400) {
                                                alert(err?.response?.data?.message || 'Thông tin không hợp lệ');
                                            } else if (!err?.response) {
                                                alert('Không kết nối được server');
                                            } else {
                                                alert('Lỗi khi thanh toán');
                                            }
                                            console.log('Error in ccPayment:', err);
                                            setLoading(false);
                                        }
                                    },
                                    (errors) => {
                                        // ❌ Có lỗi
                                        alert('Vui lòng nhập đầy đủ thông tin');
                                    })}
                            >
                                <ThemedText>Tiếp tục</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            }
        </TouchableWithoutFeedback >
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
        minHeight: '90%',
        backgroundColor: Colors.light.text,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.tabIconDefault,
    },

    body: {
        flex: 9,
        width: '90%',
        backgroundColor: 'transparent',
    },
    input: {
        justifyContent: 'center',
        borderColor: Colors.light.borderColor,
        backgroundColor: Colors.light.backgroundInput,
        height: 45,
        fontSize: 16,
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    bodyText: {
        fontSize: 16,
        color: Colors.light.tabIconDefault,
    },
    warning: {
        marginTop: '3%',
        color: Colors.light.warning,
    },

    footer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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