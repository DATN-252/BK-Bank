import { Image, ImageBackground } from 'expo-image';
import { Router, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Animated, Dimensions, Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

import { BackgroundView } from '@/components/background-view';
import PinOTP from '@/components/PinOTP';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { LoginType } from '@/types/login';
import { ForgotPasswordType, ResetPasswordType } from '@/types/resetPassword';

import AuthService from '@/service/authApi';
import CustService from '@/service/custApi';

import { useDispatch } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { setUser } from '@/redux/reducerUser';
import { getCards } from '@/redux/reducerCard';
import { saveToken } from '@/redux/reducerAuth';

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen() {
  const router: Router = useRouter();


  const [showPicker, setShowPicker] = React.useState<boolean>(false);

  // xử lý scroll ngang
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

  // xử lý screen 1: login
  const dispatch: ReduxTypes['AppDispatch'] = useDispatch();
  const { control: loginControl, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLogin } = useForm<LoginType>();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const handleLogin = async (data: LoginType) => {
    try {
      const res = await AuthService.login(data);
      const profile = await CustService.getProfile().catch(err => {
        alert('Lỗi lấy thông tin người dùng!');
        throw err;
      });
      const cards = await CustService.getCards().catch(err => {
        alert('Lỗi lấy thông tin thẻ!');
        throw err;
      });

      console.log('Login success', res);

      dispatch(saveToken(res.result.token));
      dispatch(setUser(profile.result));
      dispatch(getCards(cards.result.content));
      router.replace('/home');
    } catch (err) {
      // console.error('Login failed', err);
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };
  const buttonForgotPw = () => {
    //todo
    resetLogin();
    switchPageLogin(1);
  };

  // xử lý screen 2: forgPw
  const [onForgotPw, setOnForgotPw] = React.useState<boolean>(false);
  const { control: forgotControl, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors }, reset: resetForgotPassword } = useForm<ForgotPasswordType>();
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

  const buttonBack = () => {
    //todo
    resetForgotPassword();
    switchPageLogin(0);
    setOnForgotPw(false);
  };

  // xử lý screen 3: resetPw
  const { control: resetPasswordControl, handleSubmit: handleResetSubmit, formState: { errors: resetErrors }, reset: resetResetPassword } = useForm<ResetPasswordType>();
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const handleResetPw = () => {
    //todo
    setOnForgotPw(false);
    switchPageLogin(0);
    resetResetPassword();
  };

  // fetch API lấy background login view
  const sourceImgBackground = () => {
    // todo: fetch from API

    return require('../assets/images/bg-login.png');
  };

  return (
    // bản web sẽ không thấy
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <BackgroundView>
        <ImageBackground
          source={sourceImgBackground()}
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
                <ThemedView style={styles.header}>
                  <Image source={require('../assets/images/logo-bank.png')} style={styles.logoContainer} />
                  <ThemedText style={styles.textHeader}>
                    Chào mừng trở lại!
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.form}>
                  {loginErrors.nameAcc ?
                    <ThemedText style={{ color: Colors.light.warning }}>{loginErrors.nameAcc.message}</ThemedText>
                    : <ThemedText style={{ color: Colors.light.text }}>Tên đăng nhập:</ThemedText>
                  }
                  <Controller
                    control={loginControl}
                    name="nameAcc"
                    rules={{ required: '*Tên đăng nhập là bắt buộc!' }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Số điện thoại hoặc CCCD"
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                  {loginErrors.password ?
                    <ThemedText style={{ color: Colors.light.warning }}>{loginErrors.password.message}</ThemedText>
                    : <ThemedText style={{ color: Colors.light.text }}>Mật khẩu:</ThemedText>
                  }
                  <Controller
                    rules={{ required: '*Mật khẩu là bắt buộc!' }}
                    control={loginControl}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <ThemedView style={styles.input}>
                        <ThemedView style={styles.inputHaveIcon}>
                          <TextInput
                            placeholder="Tối thiểu 8 ký tự"
                            secureTextEntry={!showPassword}
                            onChangeText={onChange}
                            value={value}
                            style={{ flex: 1, color: Colors.light.text, fontSize: 17 }}
                          />
                          {showPassword ?
                            <TouchableOpacity onPress={() => setShowPassword(false)}>
                              <FontAwesome name="eye-slash" size={24} color={Colors.light.icon} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setShowPassword(true)}>
                              <FontAwesome name="eye" size={24} color={Colors.light.icon} />
                            </TouchableOpacity>
                          }
                        </ThemedView>
                      </ThemedView>
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
                <ThemedView style={[styles.header, { height: '5%', marginBottom: 60 }]}>
                  <ThemedText style={styles.textHeader}>Lấy lại mật khẩu</ThemedText>
                </ThemedView>

                <ThemedView style={styles.form}>
                  {forgotErrors.phone ?
                    <ThemedText style={{ color: Colors.light.warning }}>{forgotErrors.phone.message}</ThemedText>
                    : <ThemedText style={{ color: Colors.light.text }}>Số điện thoại:</ThemedText>
                  }
                  <Controller
                    rules={{ required: '*Số điện thoại là bắt buộc!' }}
                    control={forgotControl}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder=""
                        keyboardType="phone-pad"
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                  {forgotErrors.citizenId ?
                    <ThemedText style={{ color: Colors.light.warning }}>{forgotErrors.citizenId.message}</ThemedText>
                    : <ThemedText style={{ color: Colors.light.text }}>Căn cước công dân:</ThemedText>
                  }
                  <Controller
                    rules={{ required: '*Căn cước công dân là bắt buộc!' }}
                    control={forgotControl}
                    name="citizenId"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder=""
                        keyboardType="number-pad"
                        onChangeText={onChange}
                        value={value}
                        style={styles.input}
                      />
                    )}
                  />
                  {forgotErrors.dateExp ?
                    <ThemedText style={{ color: Colors.light.warning }}>{forgotErrors.dateExp.message}</ThemedText>
                    : <ThemedText style={{ color: Colors.light.text }}>Ngày hết hạn:</ThemedText>
                  }
                  <Controller
                    control={forgotControl}
                    name="dateExp"
                    rules={{ required: '*Ngày hết hạn là bắt buộc!' }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowPicker(true)}
                          style={styles.input}>
                          <ThemedView style={styles.inputHaveIcon}>
                            <ThemedText style={{ color: Colors.light.text }}>{value}</ThemedText>
                            <FontAwesome name="calendar" size={24} color={Colors.light.text} />
                          </ThemedView>
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

                                if (d[0] !== 'N') onChange(d);
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
                    <ThemedText type='subtitle' style={{ color: Colors.light.text }}>Trở lại</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* reset password */}
            <ThemedView style={styles.container}>
              {/* set width 80 vì 6 ô otp quá to */}
              <ThemedView style={[styles.containerCenter, { width: '80%' }]}>
                <ThemedView style={[styles.header, { height: '5%' }]}>
                  <ThemedText style={styles.textHeader}>Xác thực OTP</ThemedText>
                </ThemedView>

                {onForgotPw ?
                  <>
                    <ThemedText>Quý khách vui lòng nhập mã OTP gửi về số điện thoại ******6789.</ThemedText>
                    <PinOTP numberPin={6} setOnForgotPw={setOnForgotPw} />
                    <TouchableOpacity
                      style={styles.buttonBack}
                      onPress={buttonBack}>
                      <ThemedText type='subtitle' style={{ color: Colors.light.text }}>Trở lại</ThemedText>
                    </TouchableOpacity>
                  </>
                  : <>
                    {resetErrors.password ?
                      <ThemedText style={{ color: Colors.light.warning }}>{resetErrors.password.message}</ThemedText>
                      : <ThemedText style={{ color: Colors.light.text }}>Mật khẩu mới:</ThemedText>
                    }
                    <Controller
                      rules={{ required: '*Vui lòng nhập mật khẩu mới!' }}
                      control={resetPasswordControl}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <ThemedView style={styles.input}>
                          <ThemedView style={styles.inputHaveIcon}>
                            <TextInput
                              // placeholder="Nhập mật khẩu mới của bạn"
                              secureTextEntry={!showPassword}
                              onChangeText={onChange}
                              value={value}
                              style={{ flex: 1, color: Colors.light.text, fontSize: 17 }}
                            />
                            {showPassword ?
                              <TouchableOpacity onPress={() => setShowPassword(false)}>
                                <FontAwesome name="eye-slash" size={24} color={Colors.light.icon} />
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={() => setShowPassword(true)}>
                                <FontAwesome name="eye" size={24} color={Colors.light.icon} />
                              </TouchableOpacity>
                            }
                          </ThemedView>
                        </ThemedView>
                      )}
                    />
                    {resetErrors.confirmPassword ?
                      <ThemedText style={{ color: Colors.light.warning }}>{resetErrors.confirmPassword.message}</ThemedText>
                      : <ThemedText style={{ color: Colors.light.text }}>Xác nhận mật khẩu mới:</ThemedText>
                    }
                    <Controller
                      rules={{
                        required: '*Vui lòng nhập lại mật khẩu mới!',
                        validate: (value, formValues) => (value === formValues.password) || '*Mật khẩu không khớp!',
                      }}
                      control={resetPasswordControl}
                      name="confirmPassword"
                      render={({ field: { onChange, value } }) => (
                        <ThemedView style={styles.input}>
                          <ThemedView style={styles.inputHaveIcon}>
                            <TextInput
                              // placeholder="Xác nhận mật khẩu mới của bạn"
                              secureTextEntry={!showConfirmPassword}
                              onChangeText={onChange}
                              value={value}
                              style={{ flex: 1, color: Colors.light.text, fontSize: 17 }}
                            />
                            {showConfirmPassword ?
                              <TouchableOpacity onPress={() => setShowConfirmPassword(false)}>
                                <FontAwesome name="eye-slash" size={24} color={Colors.light.icon} />
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={() => setShowConfirmPassword(true)}>
                                <FontAwesome name="eye" size={24} color={Colors.light.icon} />
                              </TouchableOpacity>
                            }
                          </ThemedView>
                        </ThemedView>
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
      </BackgroundView>
    </TouchableWithoutFeedback>
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
    height: '72%',
    width: '70%',
    backgroundColor: 'transparent',
  },

  header: {
    height: '25%',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  logoContainer: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  textHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  form: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  input: {
    height: 45,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.dark.borderColor,
  },
  inputHaveIcon: {
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loginButton: {
    height: 45,
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loginThemedText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  forgot: {
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },

  buttonBack: {
    alignItems: 'center',
    borderRadius: 65,
    marginVertical: 20,
  },

});