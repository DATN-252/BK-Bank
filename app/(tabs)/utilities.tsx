import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const UTILITIES = [
  { key: '1', icon: 'phone-portrait-outline', color: '#FF4B4B', label: 'Nạp điện thoại' },
  { key: '2', icon: 'logo-usd', color: '#FFB800', label: 'Thẻ game' },
  { key: '3', icon: 'document-text-outline', color: '#00D26A', label: 'Tiền điện' },
  { key: '4', icon: 'car-outline', color: '#6B7A90', label: 'Du lịch' },
  { key: '5', icon: 'ticket-outline', color: '#B16DFF', label: 'Vé xem phim' },
  { key: '6', icon: 'airplane-outline', color: '#2D6AFF', label: 'Vé máy bay' },
];

export default function UtilScreen() {
  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
        <ThemedText type='subtitle' style={styles.title}>Tiện ích cuộc sống</ThemedText>

        <ThemedView style={styles.card}>
          <FlatList
            data={UTILITIES}
            numColumns={3}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <ThemedView style={[styles.iconBox, { backgroundColor: '#23265A' }]}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={item.color} />
                </ThemedView>
                <ThemedText>{item.label}</ThemedText>
              </TouchableOpacity>
            )}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </ThemedView>
      </ThemedView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },

  title: {
    marginBottom: 16,
  },

  card: {
    borderRadius: 16,
    height: '80%',
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  row: {
  },
  item: {
    alignItems: 'center',
    marginBottom: 24,
    minWidth: '33.33%',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
