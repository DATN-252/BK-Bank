import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { PaymentPreviewCreditType } from '@/types/payment';
import PayService from '@/service/payApi';


const randomIdempotencyKey = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const typeCreditCard = [
  { label: 'Master Card', value: 'SP0001' },
  { label: 'Master Card (3DS)', value: 'SP0002' },
  { label: 'Visa Card', value: 'SP0003' },
  { label: 'Visa Card (3DS)', value: '00020101021138540010A00000072701240006970418011063616631660208QRIBFTTA53037045802VN630485BC' },
  { label: 'JCB', value: 'SP0004' },
  { label: 'JCB (3DS)', value: 'SP0005' },
  { label: 'American Express', value: 'SP0006' },
  { label: 'American Express (3DS)', value: 'SP0007' },
];

export default function CreditTransactionScreen() {
  const router: Router = useRouter();

  // dữ liệu từ QR, nếu có, sẽ được parse sẵn và gán vào default value của form
  let { qrData } = useLocalSearchParams<{ qrData: string }>();
  const parsedQrData = qrData ? JSON.parse(qrData) : null;


  const { control: creditCardControl, handleSubmit: handleCreditCardSubmit, formState: { errors: creditCardErrors }, reset: resetCreditCard } = useForm<PaymentPreviewCreditType>({
    defaultValues: {
      recipientAccount: parsedQrData?.merchantAccount?.merchantId ?? '',
      currency: parsedQrData?.currency ?? 'USD',
      amount: parsedQrData?.amount ? Number(parsedQrData.amount) : undefined,
      cardType: 'CREDIT',
    }
  });

  // call api to process transaction, then navigate to confirm screen
  // React.useEffect(() => {
  //   //todo call api gọi data dropdown merchant
  // const dataMerchant = [
  //   { label: 'Điện lực EVN', value: 'SP0001' },
  //   { label: 'Siêu thị GO', value: 'SP0002' },
  //   { label: 'Tạp hóa Xanh', value: 'SP0003' },
  //   { label: 'Sport Yonex', value: '00020101021138540010A00000072701240006970418011063616631660208QRIBFTTA53037045802VN630485BC' },
  // ];
  //   console.log('qrData: ', qrData);

  // kiểm tra qrData có nằm trong danh sách merchant hay không, nếu không thì alert và quay về trang chủ
  // if (!dataMerchant.map(m => m.value).includes(qrData)
  //   && qrData !== undefined) {
  //   alert('Không tìm thấy dữ liệu QR. Vui lòng thử lại.');
  //   router.replace('/home');
  // }

  // }, [qrData]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>

          <ThemedView style={styles.header}>
            <ThemedText style={styles.headerText}>Thanh toán qua thẻ quốc tế/tín dụng</ThemedText>
            {/* <ThemedText style={{ color: Colors.light.tabIconDefault }}>Nhập thông tin chủ thẻ</ThemedText> */}
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
                <ThemedText style={styles.bodyText}>Bên nhận/ Cửa hàng</ThemedText>
                <Controller
                  control={creditCardControl}
                  name="recipientAccount"
                  rules={{ required: '*Bên nhận là bắt buộc!' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Nhập mã cửa hàng"
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                      editable={qrData === undefined}
                    />
                  )}
                />
              </ThemedView>

              <ThemedView>
                <ThemedText style={styles.bodyText}>Loại thẻ</ThemedText>
                <Controller
                  control={creditCardControl}
                  name="cardNetwork"
                  rules={{ required: '*Loại thẻ là bắt buộc!' }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      data={typeCreditCard}
                      labelField="label"
                      valueField="value"
                      placeholder="-- Chọn --"
                      search
                      searchPlaceholder="Tìm kiếm..."
                      value={value}
                      onChange={onChange}
                      style={[
                        styles.input,
                        (qrData !== undefined) && { opacity: 0.6 }
                      ]}
                    />
                  )}
                />
              </ThemedView>

              <ThemedView>
                {/* {creditCardErrors.cardNumber ?
              <ThemedText style={styles.warning}>{creditCardErrors.cardNumber.message}</ThemedText>
              : 
            } */}
                <ThemedText style={styles.bodyText}>Số thẻ</ThemedText>
                <Controller
                  control={creditCardControl}
                  name="cardNumber"
                  rules={{ required: '*Số thẻ là bắt buộc!' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Nhập số thẻ"
                      onChangeText={onChange}
                      keyboardType="numeric"
                      value={value}
                      style={styles.input}
                    />
                  )}
                />
              </ThemedView>

              <ThemedView style={styles.inputTwoRow}>
                <ThemedView style={{ flex: 1 }}>
                  {/* {creditCardErrors.cvc ?
                  <ThemedText style={styles.warning}>{creditCardErrors.cvc.message}</ThemedText>
                  : 
                } */}
                  <ThemedText style={styles.bodyText}>CVC/CVV</ThemedText>
                  <Controller
                    rules={{ required: '*CVC/CVV là bắt buộc!' }}
                    control={creditCardControl}
                    name="cvc"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="3 hoặc 4 chữ số"
                        onChangeText={onChange}
                        keyboardType='numeric'
                        maxLength={4}
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                  {/* {creditCardErrors.expirationDate ?
                  <ThemedText style={styles.warning}>{creditCardErrors.expirationDate.message}</ThemedText>
                  : 
                } */}
                  <ThemedText style={styles.bodyText}>Ngày hết hạn</ThemedText>
                  <Controller
                    rules={{ required: '*Ngày hết hạn là bắt buộc!' }}
                    control={creditCardControl}
                    name="expirationDate"
                    render={({ field: { onChange, value } }) => {
                      const handleChange = (text: string) => {
                        let cleaned = text.replace(/\D/g, '').slice(0, 4);

                        // Validate tháng khi có đủ 2 số
                        if (cleaned.length >= 2) {
                          let month = cleaned.slice(0, 2);

                          if (Number(month) > 12) month = '12';
                          if (Number(month) === 0) month = '01';

                          cleaned = month + cleaned.slice(2);
                        }

                        // Chỉ chèn "/" khi có ít nhất 3 số
                        if (cleaned.length >= 3) {
                          cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                        }

                        onChange(cleaned);
                      };

                      return (
                        <TextInput
                          value={value}
                          onChangeText={handleChange}
                          keyboardType="numeric"
                          placeholder="MM/YY"
                          maxLength={5}
                          // onKeyPress={({ nativeEvent }) => {
                          //   if (nativeEvent.key === 'Backspace') {
                          //     onChange('');
                          //   }
                          // }}
                          style={styles.input}
                        />
                      )
                    }}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView>
                {/* {creditCardErrors.cardholderName ?
              <ThemedText style={styles.warning}>{creditCardErrors.cardholderName.message}</ThemedText>
              : 
            } */}
                <ThemedText style={styles.bodyText}>Họ và Tên chủ thẻ</ThemedText>
                <Controller
                  rules={{ required: '*Tên chủ thẻ là bắt buộc!' }}
                  control={creditCardControl}
                  name="cardholderName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Nhập đầy đủ không dấu"
                      onChangeText={onChange}
                      autoCapitalize="characters"
                      value={value}
                      style={styles.input}
                    />
                  )}
                />
              </ThemedView>

              <ThemedView style={styles.inputTwoRow}>
                <ThemedView style={{ flex: 1 }}>
                  {/* {creditCardErrors.billingAddress ?
                  <ThemedText style={styles.warning}>{creditCardErrors.billingAddress.message}</ThemedText>
                  :
                } */}
                  <ThemedText style={styles.bodyText}>Địa chỉ đăng ký thẻ</ThemedText>
                  <Controller
                    rules={{ required: '*Địa chỉ đăng ký thẻ là bắt buộc!' }}
                    control={creditCardControl}
                    name="billingAddress"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Nhập địa chỉ"
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                </ThemedView>
                <ThemedView style={{ flex: 1 }}>
                  {/* {creditCardErrors.zipCode ?
                  <ThemedText style={styles.warning}>{creditCardErrors.zipCode.message}</ThemedText>
                  : 
                } */}
                  <ThemedText style={styles.bodyText}>Mã bưu chính</ThemedText>
                  <Controller
                    rules={{ required: '*Mã bưu điện là bắt buộc!' }}
                    control={creditCardControl}
                    name="zipCode"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Mã zip"
                        onChangeText={onChange}
                        keyboardType="numeric"
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView>
                {/* {creditCardErrors.amount ?
              <ThemedText style={styles.warning}>{creditCardErrors.amount.message}</ThemedText>
              : 
            } */}
                <ThemedText style={styles.bodyText}>Số tiền</ThemedText>
                <Controller
                  rules={{ required: '*Số tiền là bắt buộc!' }}
                  control={creditCardControl}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="USD"
                      keyboardType="numeric"
                      onChangeText={onChange}
                      value={value?.toString() ?? ''}
                      style={styles.input}
                      editable={parsedQrData?.amount === undefined}
                    />
                  )}
                />
              </ThemedView>
            </KeyboardAwareScrollView >
          </ThemedView>

          <ThemedView style={styles.footer}>
            <TouchableOpacity
              style={styles.buttonFooter}
              onPress={handleCreditCardSubmit(
                async (data) => {
                  try {
                    // bỏ trường cardType trước khi gửi data, vì backend không cần trường này
                    const { cardNetwork, ...dataToSend } = data;
                    // console.log('Data for confirm: ', dataToSend);

                    const res = await PayService.paymentPreviewCredit(dataToSend);

                    if (res.result.status === 'VALID') {
                      router.push({
                        pathname: '/transaction/confirm',
                        params: {
                          confirmData: JSON.stringify({
                            ...res.result,

                            // truyền thêm vài trường cần
                            cardNumber: data.cardNumber,
                            cvc: data.cvc,
                            expirationDate: data.expirationDate,
                            idempotencyKey: randomIdempotencyKey(),
                          }),
                        },
                      });
                      resetCreditCard();
                    }
                    else alert('Thông tin không hợp lệ. Vui lòng kiểm tra lại thông tin thẻ hoặc thử thẻ khác.');
                  } catch (err: any) {
                    if (err?.response?.status === 401) {
                      alert('Thông tin không hợp lệ');
                    } else if (!err?.response) {
                      alert('Không kết nối được server');
                    } else {
                      alert('Lỗi khi thanh toán');
                    }
                    alert('Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.');
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
    </TouchableWithoutFeedback >
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
  inputTwoRow: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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