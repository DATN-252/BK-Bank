import React from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Router, useRouter } from 'expo-router';
import CustService from '@/service/custApi';
import { useDispatch } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { addToNoti } from '@/redux/reducerNoti';
import { NotificationType } from '@/types/noti';

// Handler (giữ ngoài component)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        // shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const PushNotificationManager = ({ children }: { children: React.ReactNode }) => {
    const router: Router = useRouter();
    const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

    // lấy token
    const registerForPush = async (): Promise<string | null> => {
        if (!Device.isDevice) {
            console.warn('Phải dùng máy thật');
            return null;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
            });
        }
        // else if (Platform.OS === 'ios') {
        //     await Notifications.requestPermissionsAsync({
        //         ios: {
        //             allowAlert: true,
        //             allowBadge: true,
        //             allowSound: true,
        //         },
        //     });
        // }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Không có quyền notification');
            return null;
        }

        try {
            const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ??
                Constants.easConfig?.projectId;

            if (!projectId) {
                console.error('Thiếu projectId');
                return null;
            }

            const token = (
                await Notifications.getExpoPushTokenAsync({ projectId })
            ).data;

            console.log('Push Token:', token);
            return token;
        } catch (err) {
            console.error('Lỗi lấy token:', err);
            return null;
        }
    };

    React.useEffect(() => {
        let receivedSub: Notifications.Subscription;
        let responseSub: Notifications.Subscription;

        (async () => {
            // Đăng ký nhận token và gửi lên server 
            const token = await registerForPush();
            if (token) {
                await CustService.saveToken(token);
            }

            // nhận khi app mở
            receivedSub = Notifications.addNotificationReceivedListener((noti) => {
                console.log('Received:', noti.request.content.data);
                const data = noti.request.content.data as unknown as NotificationType;
                dispatch(addToNoti({
                    ...data,
                    readed: false
                }));
            });

            // khi click notification
            responseSub = Notifications.addNotificationResponseReceivedListener(
                (res) => {
                    const data = res.notification.request.content.data;

                    // điều hướng vào detail của notification, tạm thời vô trang thông báo thôi
                    router.push('/notification');
                    console.log('Response:', data);
                    // if (data) {
                    //     router.push({
                    //         pathname: '/notification/detail',
                    //         params: { id: data.id },
                    //     });
                    // } else {
                    // }
                }
            );
        })();

        return () => {
            receivedSub?.remove();
            responseSub?.remove();
        };
    }, []);

    return <>{children}</>;
};

export default PushNotificationManager;