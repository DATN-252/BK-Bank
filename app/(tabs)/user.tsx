
import { Redirect } from 'expo-router';
import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import AuthService from '@/service/authApi';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/reducerAuth';
import { ReduxTypes } from '@/store/reduxStore';

const maskEmail = (email?: string) => {
  if (!email) return '';

  const [localPart, domain] = email.split('@');
  if (!domain) return '***';

  if (localPart.length <= 2) {
    return `${localPart[0] || '*'}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
};

const maskPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return '';

  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length <= 4) return '****';

  const visibleTail = digitsOnly.slice(-4);
  return `******${visibleTail}`;
};



export default function UserScreen() {
  // const router: Router = useRouter();

  const dispatch: ReduxTypes['AppDispatch'] = useDispatch();
  const userInfo = useSelector((state: ReduxTypes['RootState']) => state.userInfo);
  const maskedEmail = maskEmail(userInfo?.email);
  const maskedPhoneNumber = maskPhoneNumber(userInfo?.phoneNumber);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch(logout());
      return <Redirect href="/login" />;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.profileSection}>
          <ThemedView style={styles.avatarWrapper}>
            <Image
              source={
                userInfo?.avatar
                  ? { uri: userInfo.avatar }
                  : require('@/assets/images/favicon.png')
              }
              style={styles.avatar} />
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color='black' />
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={styles.name}>{userInfo?.fullName}</ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText
              style={[styles.info, styles.infoEmail]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {maskedEmail}
            </ThemedText>
            <ThemedText style={styles.infoSeparator}>|</ThemedText>
            <ThemedText
              style={[styles.info, styles.infoPhone]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {maskedPhoneNumber}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity>
            <Row icon="person-outline" label="Thông tin cá nhân" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="notifications-outline" label="Thông báo" right={<ThemedText style={styles.rightThemedText}>Bật</ThemedText>} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="language-outline" label="Ngôn ngữ" right={<ThemedText style={styles.rightThemedText}>Tiếng Việt</ThemedText>} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity>
            <Row icon="shield-outline" label="Bảo mật" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="color-palette-outline" label="Chủ đề" right={<ThemedText style={styles.rightThemedText}>Tự động</ThemedText>} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity>
            <Row icon="help-circle-outline" label="Hỗ trợ" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="call-outline" label="Liên hệ" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="document-text-outline" label="Chính sách bảo mật" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity onPress={handleLogout}>
            <Row icon="log-out" label="Đăng xuất" color="#ff0000" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </BackgroundView>
  );
}

function Row({ icon, label, right, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; right?: React.ReactNode, color?: string }) {
  return (
    <ThemedView style={styles.row}>
      <Ionicons name={icon} size={24} color={color || Colors.light.icon} style={{ marginRight: 16 }} />
      <ThemedText type='defaultSemiBold'>{label}</ThemedText>
      <ThemedView style={{ flex: 1 }} />
      {right}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '9%',
    backgroundColor: 'transparent',
  },

  profileSection: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6EAF3',
    resizeMode: 'cover',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E6EAF3',
    elevation: 2,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  info: {
    fontSize: 14,
    color: '#E6EAF3',
  },
  infoRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  infoEmail: {
    flex: 1,
    minWidth: 0,
    textAlign: 'right',
  },
  infoPhone: {
    flex: 1,
    minWidth: 0,
  },
  infoSeparator: {
    fontSize: 14,
    color: '#E6EAF3',
    marginHorizontal: 6,
  },

  card: {
    width: '100%',
    marginBottom: '7%',
    borderRadius: 12,
  },
  row: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rightThemedText: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
});
