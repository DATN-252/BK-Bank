import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

const DATA_BALANCE = [
  {
    id: '1',
    type: 'up',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '+1.000.000 USD',
  },
  {
    id: '2',
    type: 'down',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '-200.000 USD',
  },
  {
    id: '3',
    type: 'up',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '+200.000 USD',
  },
  {
    id: '4',
    type: 'down',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '-200.000 USD',
  },
  {
    id: '5',
    type: 'up',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '+200.000 USD',
  },
  {
    id: '6',
    type: 'down',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '-200.000 USD',
  },
  {
    id: '7',
    type: 'up',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '+200.000 USD',
  },
  {
    id: '8',
    type: 'down',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '-200.000 USD',
  },
  {
    id: '9',
    type: 'up',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '+200.000 USD',
  },
  {
    id: '10',
    type: 'down',
    code: '012345678',
    date: '5 Oct 2020',
    amount: '-200.000 USD',
  }
];

const DATA_GENERAL = [
  {
    id: '1',
    icon: 'gift-outline',
    title: 'Khuyến mãi mở thẻ',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '2',
    icon: 'settings-outline',
    title: 'Bảo trì hệ thống 20/12',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '3',
    icon: 'help-circle-outline',
    title: 'Hướng dẫn mở số tk',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '4',
    icon: 'cloud-upload-outline',
    title: 'Nâng cấp hệ thống',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '5',
    icon: 'shield-checkmark-outline',
    title: 'Yêu cầu bật xác thực 2 lớp',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
];

export default function NotificationScreen() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'balance' | 'general'>('balance');

  const filteredBalance = DATA_BALANCE.filter(item =>
    item.code.includes(search)
  );
  const filteredGeneral = DATA_GENERAL.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderBalanceItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.iconBox}>
        <Ionicons
          name={item.type === 'up' ? 'arrow-up' : 'arrow-down'}
          size={24}
          color={item.type === 'up' ? '#00D26A' : 'red'}
        />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.code}>{item.code}</ThemedText>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </ThemedView>
      <ThemedText style={[styles.amount, { color: item.type === 'up' ? '#00D26A' : 'red' }]}>{item.amount}</ThemedText>
    </ThemedView>
  );

  const renderGeneralItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.iconBox}>
        <Ionicons name={item.icon} size={24} color={Colors.light.tint} />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.code}>{item.title}</ThemedText>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </ThemedView>
      <TouchableOpacity>
        <ThemedText style={styles.link}>{item.link}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <BackgroundView>
        <ThemedView style={styles.container}>
          <ThemedText type='title' style={styles.title}>Thông báo</ThemedText>

          <ThemedView style={styles.searchBox}>
            <Ionicons name="search" size={20} color={Colors.light.icon} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder={tab === 'balance' ? 'Tìm kiếm giao dịch' : 'Tìm kiếm thông báo'}
              placeholderTextColor={Colors.light.text}
              value={search}
              onChangeText={setSearch}
            />
          </ThemedView>

          <ThemedView style={styles.tabRow}>
            <TouchableOpacity style={[styles.tab, tab === 'balance' && styles.tabActive]} onPress={() => setTab('balance')}>
              <ThemedText type='defaultSemiBold' style={tab === 'balance' && styles.tabTextActive}>Biến động</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === 'general' && styles.tabActive]} onPress={() => setTab('general')}>
              <ThemedText type='defaultSemiBold' style={tab === 'general' && styles.tabTextActive}>Kênh chung</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <FlatList
            data={tab === 'balance' ? filteredBalance : filteredGeneral}
            keyExtractor={item => item.id}
            renderItem={tab === 'balance' ? renderBalanceItem : renderGeneralItem}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </BackgroundView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  title: {
    marginVertical: 16,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundIcon,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.icon,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    // backgroundColor: Colors.light.backgroundIcon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  date: {
    fontSize: 12,
    color: '#000000',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 15,
    minWidth: 110,
    textAlign: 'right',
  },

  tabRow: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabTextActive: {
    color: Colors.light.tabIconSelected,
  },

  link: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'right',
  },
});
