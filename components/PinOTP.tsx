
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
    const [pinArray, setPinArray] = React.useState<number[]>(Array(numberPin).fill(''));

    // resend code
    const [isResendDisabled, setIsResendDisabled] = React.useState<boolean>(false);
    const [countdown, setCountdown] = React.useState<number>(30);

    const onSubmit = (pin: string) => {
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
            <ThemedText style={{ color: 'white' }}>Xác thực OTP</ThemedText>
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
                            const newPin = [...pinArray];
                            newPin[item] = Number(text);
                            setPinArray(newPin);

                            if (text.length === 1) {
                                if (item < numberPin - 1) refInputs.current[item + 1]?.focus();
                                else {
                                    const pin = newPin.join('');
                                    onSubmit(pin);
                                }
                            }
                        }}
                        style={styles.inputPin}
                        maxLength={1}
                        keyboardType="number-pad"
                    />
                ))}
            </ThemedView>
            <TouchableOpacity
                style={[styles.buttonLogin, isResendDisabled && { backgroundColor: '#ccc' }]}
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
                <ThemedText type="subtitle" style={{ color: Colors.light.tint }}>
                    {isResendDisabled ? `Wait ${countdown}s` : 'Resend Code'}
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
    },

    buttonLogin: {
        borderRadius: 65,
        backgroundColor: 'white',
        alignItems: 'center',
    },
});