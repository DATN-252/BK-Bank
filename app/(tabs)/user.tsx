
import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';


export default function UserScreen() {
  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.profileSection}>
          <ThemedView style={styles.avatarWrapper}>
            <Image source={require('@/assets/images/favicon.png')} style={styles.avatar} />
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color='black' />
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={styles.name}>Nguyen Van A</ThemedText>
          <ThemedText style={styles.info}>youremail@domain.com | +01 234 567 89</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity>
            <Row icon="person-outline" label="Thông tin cá nhân" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="notifications-outline" label="Thông báo" right={<ThemedText style={styles.rightThemedText}>ON</ThemedText>} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="language-outline" label="Ngôn ngữ" right={<ThemedText style={styles.rightThemedText}>English</ThemedText>} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.card}>
          <TouchableOpacity>
            <Row icon="shield-outline" label="Bảo mật" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Row icon="color-palette-outline" label="Chủ đề" right={<ThemedText style={styles.rightThemedText}>Light mode</ThemedText>} />
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
      </ThemedView>
    </BackgroundView>
  );
}

function Row({ icon, label, right }: { icon: keyof typeof Ionicons.glyphMap; label: string; right?: React.ReactNode }) {
  return (
    <ThemedView style={styles.row}>
      <Ionicons name={icon} size={24} color={Colors.light.icon} style={{ marginRight: 16 }} />
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
    marginBottom: 4,
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
    color: Colors.light.tabIconSelected,
    fontWeight: 'bold',
  },
});
