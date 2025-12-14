import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import PinOTP from '@/components/PinOTP';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoginType } from '@/types/login';
import { Fontisto } from '@expo/vector-icons';
import { ForgotPasswordType, ResetPasswordType } from '@/types/resetPassword';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');


export default function LoginScreen() {
  const router = useRouter();


  const [showPicker, setShowPicker] = React.useState(false);


  const scrollX = React.useRef(new Animated.Value(0)).current;
  const refScroll = React.useRef<ScrollView>(null);
  const switchPageLogin = (page: number) => {
    Animated.timing(scrollX, {
      toValue: screenWidth * page,
      duration: 1200,
      useNativeDriver: false, // phải là false vì scrollView không hỗ trợ native driver ở scrollX
    }).start();

    scrollX.addListener(({ value }: { value: number }) => {
      refScroll.current?.scrollTo({ x: value, animated: false });
    });
  };

  const { control: loginControl, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginType>();
  const handleLogin = (data: LoginType) => {
    //todo
    console.log(data);
  };
  const buttonForgotPw = () => {
    //todo
    switchPageLogin(1);
  };

  const buttonBack = () => {
    switchPageLogin(0);
    setOnForgotPw(false);
  };

  const [onForgotPw, setOnForgotPw] = React.useState<boolean>(false);
  const { control: forgotControl, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordType>();
  const handleForgotPw = (data: ForgotPasswordType) => {
    //todo
    if (data.phone) {
      alert('Pin OTP is: 666666');
      alert('Check the code in your SMS!');
      switchPageLogin(2);
      setOnForgotPw(true);
    }
    else {
      alert('Thông tin không hợp lệ!');
    }
  };

  const { control: resetPasswordControl, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<ResetPasswordType>();
  const handleResetPw = () => {
    //todo
    setOnForgotPw(false);
    switchPageLogin(0);
  };

  return (
      // bản web sẽ không thấy

    <LinearGradient
      colors={['#36ADFF', '#030391']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <ImageBackground
        source={require('../assets/images/bg-login.png')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        contentFit="contain"
      >
        <ScrollView
          ref={refScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{ flex: 1, backgroundColor: 'transparent' }}
          scrollEnabled={false}
        >
          {/* form login */}
          <ThemedView style={styles.container}>
            <ThemedView style={styles.containerCenter}>
              <Image source={require('../assets/images/logo-bank.png')} style={styles.logoContainer} />
              <ThemedText style={styles.welcome}>Chào mừng trở lại!</ThemedText>

              <ThemedView style={styles.form}>
                {loginErrors.nameAcc ?
                  <ThemedText style={{ color: 'red' }}>{loginErrors.nameAcc.message}</ThemedText>
                  : <ThemedText style={{ color: 'white' }}></ThemedText>
                }
                <Controller
                  control={loginControl}
                  name="nameAcc"
                  rules={{ required: '*Tên đăng nhập là bắt buộc!' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Tên đăng nhập"
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                />
                {loginErrors.password ?
                  <ThemedText style={{ color: 'red' }}>{loginErrors.password.message}</ThemedText>
                  : <ThemedText style={{ color: 'white' }}></ThemedText>
                }
                <Controller
                  rules={{ required: '*Mật khẩu là bắt buộc!' }}
                  control={loginControl}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Mật khẩu"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit(handleLogin)}>
                  <ThemedText style={styles.loginThemedText}>Đăng nhập</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={buttonForgotPw}>
                  <ThemedText style={styles.forgot}>Quên mật khẩu ?</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>


          {/* form xác minh thông tin */}
          <ThemedView style={styles.container}>
            <ThemedView style={styles.containerCenter}>
               <ThemedText style={styles.welcome}>Lấy lại mật khẩu</ThemedText>
              {forgotErrors.phone ?
                <ThemedText style={{ color: 'red' }}>{forgotErrors.phone.message}</ThemedText>
                : <ThemedText style={{ color: 'white' }}>Số điện thoại:</ThemedText>
              }
              <Controller
                rules={{ required: '*Số điện thoại là bắt buộc!' }}
                control={forgotControl}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nhập số điện thoại của bạn"
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                )}
              />
              {forgotErrors.citizenId ?
                <ThemedText style={{ color: 'red' }}>{forgotErrors.citizenId.message}</ThemedText>
                : <ThemedText style={{ color: 'white' }}>Căn cước công dân:</ThemedText>
              }
              <Controller
                rules={{ required: '*Căn cước công dân là bắt buộc!' }}
                control={forgotControl}
                name="citizenId"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nhập căn cước công dân của bạn"
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                )}
              />
              {forgotErrors.dateExp ?
                <ThemedText style={{ color: 'red' }}>{forgotErrors.dateExp.message}</ThemedText>
                : <ThemedText style={{ color: 'white' }}>Ngày hết hạn trên căn cước:</ThemedText>
              }
              <Controller
                control={forgotControl}
                name="dateExp"
                rules={{ required: '*Ngày hết hạn là bắt buộc!' }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowPicker(true)}
                      style={styles.input}
                    >
                      {/* <ThemedText style={{ color: "white" }}>
                   {value ? value : "dd/mm/yyyy"}
                  </ThemedText>  */}
                    </TouchableOpacity>

                    {showPicker && (
                      <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          setShowPicker(false);
                          if (selectedDate) {
                            const d =
                              selectedDate.getDate().toString().padStart(2, '0') + "/" +
                              (selectedDate.getMonth() + 1).toString().padStart(2, '0') + "/" +
                              selectedDate.getFullYear();

                            onChange(d);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleForgotSubmit(handleForgotPw)}>
                <ThemedText type="subtitle" style={styles.loginThemedText}>Xác nhận</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonBack}
                onPress={buttonBack}>
                <ThemedText type='subtitle' style={{ color: 'white' }}>Back</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* reset password */}
          <ThemedView style={styles.container}>
        <ThemedView style={styles.containerCenter}>
          {onForgotPw ?
            <PinOTP numberPin={6} setOnForgotPw={setOnForgotPw} />
            : <>
              {resetErrors.password ?
                <ThemedText style={{ color: 'red' }}>{resetErrors.password.message}</ThemedText>
                : <ThemedText style={{ color: 'white' }}>Mật khẩu:</ThemedText>
              }
              <Controller
                rules={{ required: '*Vui lòng nhập mật khẩu mới!' }}
                control={resetPasswordControl}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nhập mật khẩu mới của bạn"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                )}
              />
              {resetErrors.confirmPassword ?
                <ThemedText style={{ color: 'red' }}>{resetErrors.confirmPassword.message}</ThemedText>
                : <ThemedText style={{ color: 'white' }}>Xác nhận mật khẩu:</ThemedText>
              }
              <Controller
                rules={{
                  required: '*Vui lòng nhập lại mật khẩu mới!',
                  validate: (value, formValues) => (value === formValues.password) || '*Mật khẩu không khớp!',
                }}
                control={resetPasswordControl}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Xác nhận mật khẩu mới của bạn"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                )}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleResetSubmit(handleResetPw)}>
                <ThemedText type="subtitle" style={styles.loginThemedText}>Xác nhận</ThemedText>
              </TouchableOpacity>
            </>
          }
        </ThemedView>
      </ThemedView>

        </ScrollView >
      </ImageBackground>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },

  containerCenter: {
    width: '70%',
    backgroundColor: 'transparent',
  },

  logoContainer: {
    width: '100%',
    height: '24%',
    resizeMode: 'contain',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  input: {
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: 'white',
    fontSize: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  loginButton: {
    height: 56,
    backgroundColor: '#030391',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loginThemedText: {
    color: Colors.dark.text,
    fontSize: 20,
  },
  forgot: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },

  buttonBack: {
    alignItems: 'center',
    borderRadius: 65,
    marginVertical: 20,
  },

});