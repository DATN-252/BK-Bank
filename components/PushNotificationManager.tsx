import React from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Router, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { addToNoti } from '@/redux/reducerNoti';
import { NotificationBalanceType } from '@/types/noti';

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

// lấy token
export const registerForPush = async (): Promise<string | null> => {
    if (!Device.isDevice) {
        console.warn('Nên dùng máy thật');
        // return null;
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

const PushNotificationManager = ({ children }: { children: React.ReactNode }) => {
    const router: Router = useRouter();
    const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

    React.useEffect(() => {
        let receivedSub: Notifications.Subscription;
        let responseSub: Notifications.Subscription;

        (async () => {
            //   const tokenMess = await registerForPush();
            //   console.log('Token message:', tokenMess);

            // nhận khi app mở
            receivedSub = Notifications.addNotificationReceivedListener((noti) => {
                const data = (noti.request.content.data as { result: NotificationBalanceType }).result;
                dispatch(addToNoti({
                    ...data,
                    readed: false
                }));
                console.log('Received noti:', noti.request.content.data);
            });

            // khi click notification
            responseSub = Notifications.addNotificationResponseReceivedListener(
                (res) => {
                    const data = (res.notification.request.content.data as { result: NotificationBalanceType }).result;

                    // điều hướng vào detail của notification, tạm thời vô trang thông báo thôi
                    if (data) {
                        router.push('/notification');
                        // console.log('Response:', data);
                        //     router.push({
                        //         pathname: '/notification/detail',
                        //         params: { id: data.id },
                        //     });
                    }
                }
            );
        })();

        return () => {
            receivedSub?.remove();
            responseSub?.remove();
        };
    }, [dispatch, router]);

    return <>{children}</>;
};

export default PushNotificationManager;