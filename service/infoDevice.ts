import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';


export const getDeviceInfo = async () => {
    const loc = await requestLocation();

    return {
        deviceId: Application.getAndroidId() || 'unknown', // Android only
        phoneBrand: Device.brand,
        // model: Device.modelName,
        systemName: Device.osName,
        systemVersion: Device.osVersion,
        appVersion: Application.nativeApplicationVersion,
        lat: loc?.coords?.latitude ?? null,
        lng: loc?.coords?.longitude ?? null,
    };
};

export const requestLocation = async () => {
    // todo ko ép người dùng phải cung cấp vị trí thì mới thanh toán được, nhưng nếu có thì sẽ tăng trust hơn
    try {
        // 1. check service bật chưa
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            // console.log('GPS đang tắt');
            // alert('GPS đang tắt. Vui lòng bật GPS để tiếp tục thanh toán');
            return null;
        }

        // 2. xin quyền
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return null;
            Alert.alert(
                'Cần quyền vị trí',
                'Bạn cần cấp quyền vị trí để tiếp tục thanh toán',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Mở cài đặt',
                        onPress: () => Linking.openSettings(),
                    },
                ]
            );
        }

        // 3. thử lấy last known trước (nhanh + ít fail)
        const last = await Location.getLastKnownPositionAsync();
        if (last) return last;

        // 4. fallback lấy realtime (low accuracy)
        return await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
        });

    } catch (err) {
        // console.log('Location error:', err);
        return null;
    }
};