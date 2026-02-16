import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Controller, useForm } from "react-hook-form";
import { CreditCardType } from '@/types/card';



export default function TransactionScreen() {
  const router: Router = useRouter();
  const { qrData } = useLocalSearchParams<{ qrData: string }>();
  const { control: creditCardControl, handleSubmit: handleCreditCardSubmit, formState: { errors: creditCardErrors }, reset: resetCreditCard } = useForm<CreditCardType>();


  return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.headerText}>Thanh toán qua thẻ quốc tế/tín dụng</ThemedText>
            <ThemedText style={{ color: Colors.light.tabIconDefault }}>Nhập thông tin chủ thẻ</ThemedText>
          </ThemedView>

          <ThemedView style={styles.body}>
            {creditCardErrors.numCard ?
              <ThemedText style={styles.bodyText}>{creditCardErrors.numCard.message}</ThemedText>
              : <ThemedText style={styles.bodyText}>Số thẻ</ThemedText>
            }
            <Controller
              control={creditCardControl}
              name="numCard"
              rules={{ required: '*Số thẻ là bắt buộc!' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập số thẻ"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            <ThemedView style={styles.inputTwoRow}>
              <ThemedView style={{ flex: 1, marginTop: '3%' }}>
                {creditCardErrors.cvc ?
                  <ThemedText style={{ color: Colors.light.warning }}>{creditCardErrors.cvc.message}</ThemedText>
                  : <ThemedText style={styles.bodyText}>CVC/CVV</ThemedText>
                }
                <Controller
                  rules={{ required: '*CVC/CVV là bắt buộc!' }}
                  control={creditCardControl}
                  name="cvc"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="3 hoặc 4 chữ số"
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                />
              </ThemedView>
              <ThemedView style={{ flex: 1, marginTop: '3%' }}>
                {creditCardErrors.dateCard ?
                  <ThemedText style={{ color: Colors.light.warning }}>{creditCardErrors.dateCard.message}</ThemedText>
                  : <ThemedText style={styles.bodyText}>Ngày hết hạn</ThemedText>
                }
                <Controller
                  rules={{ required: '*Ngày hết hạn là bắt buộc!' }}
                  control={creditCardControl}
                  name="dateCard"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="MM/YY"
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                />
              </ThemedView>
            </ThemedView>

            {creditCardErrors.cardholderName ?
              <ThemedText style={{ color: Colors.light.warning }}>{creditCardErrors.cardholderName.message}</ThemedText>
              : <ThemedText style={styles.bodyText}>Họ và Tên chủ thẻ</ThemedText>
            }
            <Controller
              rules={{ required: '*Tên chủ thẻ là bắt buộc!' }}
              control={creditCardControl}
              name="cardholderName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập họ và tên chủ thẻ (không dấu)"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />
            {creditCardErrors.addressRegister ?
              <ThemedText style={{ color: Colors.light.warning }}>{creditCardErrors.addressRegister.message}</ThemedText>
              : <ThemedText style={styles.bodyText}>Địa chỉ đăng ký thẻ</ThemedText>
            }
            <Controller
              rules={{ required: '*Địa chỉ đăng ký thẻ là bắt buộc!' }}
              control={creditCardControl}
              name="addressRegister"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập địa chỉ"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />
            {creditCardErrors.amount ?
              <ThemedText style={{ color: Colors.light.warning }}>{creditCardErrors.amount.message}</ThemedText>
              : <ThemedText style={styles.bodyText}>Số tiền</ThemedText>
            }
            <Controller
              rules={{ required: '*Số tiền là bắt buộc!' }}
              control={creditCardControl}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="VND"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value?.toString() ?? ''}
                  style={styles.input}
                />
              )}
            />
          </ThemedView>

          <ThemedView style={styles.footer}>
            <TouchableOpacity
              style={styles.buttonFooter}
              onPress={handleCreditCardSubmit((data) => {
                // router.push({
                //   pathname: '/transaction/creditcard/confirm',
                //   params: {
                //     qrData,
                //     ...data,
                //   }
                // });
                resetCreditCard();
              })}
            >
              <ThemedText>Tiếp tục</ThemedText>
            </TouchableOpacity>
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
    flex: 6,
    width: '90%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    justifyContent: 'center',
    borderColor: Colors.light.borderColor,
    backgroundColor: Colors.light.backgroundInput,
    height: 60,
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
    marginTop: '3%',
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  inputTwoRow: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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