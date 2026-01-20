
import React from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { ResetPasswordType } from '@/types/resetPassword';

interface PinOTPProps {
    // handleRegisterSubmit: (onValid: SubmitHandler<ResetPasswordType>, onInvalid?: SubmitErrorHandler<ResetPasswordType> | undefined) => (e?: React.BaseSyntheticEvent) => Promise<void>
    // handleRegister: (data: ResetPasswordType) => void;
    setOnForgotPw: React.Dispatch<React.SetStateAction<boolean>>;
    numberPin: number;
}

export default function PinOTP({ numberPin, setOnForgotPw }: PinOTPProps) {
    const refInputs = React.useRef<(TextInput | null)[]>([]);

    // initialState là rỗng
    const [pinArray, setPinArray] = React.useState<string[]>(Array(numberPin).fill(''));

    // resend code
    const [isResendDisabled, setIsResendDisabled] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(30);

    React.useEffect(() => {
        refInputs.current[0]?.focus();
    }, []);

    const onSubmit = (ArrPin: string[]) => {
        const pin = ArrPin.join('');
        console.log('PIN entered:', pin);
        //todo verify pin
        if (pin === numberPin.toString().repeat(numberPin)) {
            // handleRegisterSubmit(handleRegister)();
            setOnForgotPw(false);
        } else {
            Alert.alert("Error", "Invalid OTP!");
        }
        setPinArray(Array(numberPin).fill(''));
        refInputs.current[0]?.focus();
    };

    return (
        <>
            <ThemedView style={{
                width: '100%',
                minHeight: '7%',
                backgroundColor: 'transparent',
                marginBottom: 40,
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
            }}
            >
                {Array.from({ length: numberPin }, (_, i) => i).map((item) => (
                    <TextInput
                        key={item}
                        ref={(input) => { refInputs.current[item] = input; }}
                        value={pinArray[item].toString()}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                setPinArray(Array(numberPin).fill(''));
                                refInputs.current[0]?.focus();
                            }
                        }}
                        onChangeText={(text) => {
                            if (text.length === 2) text = text.charAt(1);

                            const newPin = [...pinArray];
                            newPin[item] = text;
                            setPinArray(newPin);

                            // length === 1 nghĩa là đã nhập ký tự
                            if (text.length === 1) {
                                if (item < numberPin - 1) {
                                    newPin[item + 1] = '';
                                    refInputs.current[item + 1]?.focus();
                                }
                                else {
                                    onSubmit(newPin);
                                    return;
                                }
                            }
                        }}
                        style={styles.inputPin}
                        maxLength={2}
                        keyboardType="number-pad"
                    />
                ))}
            </ThemedView>
            <TouchableOpacity
                style={[styles.buttonSendAgain, { opacity: isResendDisabled ? 0.7 : 1 }]}
                disabled={isResendDisabled}
                onPress={() => {
                    setCountdown(30);
                    setIsResendDisabled(true);
                    alert('Code has been resent!');

                    const timer = setInterval(() => {
                        setCountdown(prev => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                setIsResendDisabled(false);
                                return 30;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }}
            >
                <ThemedText style={{ color: Colors.light.text }}>
                    {isResendDisabled ? `Vui lòng đợi ${countdown}s` : 'Gửi lại?'}
                </ThemedText>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    inputPin: {
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        textAlign: 'center',
        width: 50,
        aspectRatio: 1,
        fontSize: 25,
        marginHorizontal: 2,
        color: Colors.light.text,
    },

    buttonSendAgain: {
        height: 45,
        backgroundColor: Colors.light.tint,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
});