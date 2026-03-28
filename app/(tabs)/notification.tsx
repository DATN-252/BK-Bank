import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import CustService from '@/service/custApi';

import { useDispatch, useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { addAllNoti, NotiBalance, removeAllNoti } from '@/redux/reducerNoti';



// const DATA_BALANCE = [
//   {
//     id: '1',
//     transactionType: 'up',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '+1.000.000 USD',
//   },
//   {
//     id: '2',
//     transactionType: 'down',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '-200.000 USD',
//   },
//   {
//     id: '3',
//     transactionType: 'up',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '+200.000 USD',
//   },
//   {
//     id: '4',
//     transactionType: 'down',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '-200.000 USD',
//   },
//   {
//     id: '5',
//     transactionType: 'up',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '+200.000 USD',
//   },
//   {
//     id: '6',
//     transactionType: 'down',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '-200.000 USD',
//   },
//   {
//     id: '7',
//     transactionType: 'up',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '+200.000 USD',
//   },
//   {
//     id: '8',
//     transactionType: 'down',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '-200.000 USD',
//   },
//   {
//     id: '9',
//     transactionType: 'up',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '+200.000 USD',
//   },
//   {
//     id: '10',
//     transactionType: 'down',
//     merchantId: '012345678',
//     transactionDate: '5 Oct 2020',
//     amount: '-200.000 USD',
//   }
// ];

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
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState<'balance' | 'general'>('balance');

  const [refreshing, setRefreshing] = React.useState(false);
  const DATA_BALANCE: NotiBalance[] = useSelector((state: ReduxTypes['RootState']) => state.notification);
  // cho viec xoa hoac readed
  const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

  const refreshNotifications = React.useCallback(async () => {
    setRefreshing(true);

    try {
      // xóa hết thông báo cũ đi rồi thêm thông báo mới vào
      dispatch(removeAllNoti());

      const data = await CustService.getNotiBalance();

      dispatch(addAllNoti(data.result.content));
    } catch (err) {
      console.log(err);
      alert('Lấy thông báo thất bại!');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);


  const renderBalanceItem = ({ item }: { item: NotiBalance }) => (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.iconBox}>
        <Ionicons
          name={item.status === 'SUCCESS' ? (item.transactionType !== 'CHARGE' ? 'arrow-up' : 'arrow-down') : 'alert'}
          size={24}
          color={item.status === 'SUCCESS' && item.transactionType !== 'CHARGE' ? '#00D26A' : 'red'}
        />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.textKey}>Từ:
          <ThemedText style={styles.textValue}> {item.accountNumber}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>Đến:
          <ThemedText style={styles.textValue}> {item.merchantId}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>Nội dung:
          <ThemedText style={styles.textValue}> {`"${item.description}"`}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>{item.accountType === 'LOAN' ? 'Số tiền vay cuối:' : 'Số dư cuối:'} 
          <ThemedText style={styles.textValue}> {item.balanceAfter} {item.currency}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>{item.transactionDate?.split("T")[0] || "N/A"} | Trạng thái: {item.status}</ThemedText>
      </ThemedView>
      <ThemedText style={[styles.amount, { color: item.transactionType !== 'CHARGE' ? '#00D26A' : 'red' }]}>{item.transactionType !== 'CHARGE' ? "+" + item.amount : "-" + item.amount} {item.currency}</ThemedText>
    </ThemedView>
  );

  const renderGeneralItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.row}>
      <ThemedView style={styles.iconBox}>
        <Ionicons name={item.icon} size={24} color={Colors.light.tint} />
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.textValue}>{item.title}</ThemedText>
        <ThemedText style={styles.textKey}>{item.date}</ThemedText>
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
          <ThemedText type='subtitle' style={styles.title}>Thông báo</ThemedText>

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

          {tab === 'balance' ? (
            <FlatList
              data={DATA_BALANCE}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={renderBalanceItem}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing} // hiện ui loading
              onRefresh={refreshNotifications}
            />
          ) : (
            <FlatList
              data={DATA_GENERAL}
              keyExtractor={item => item.id}
              renderItem={renderGeneralItem}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  textKey: {
    fontSize: 12,
    color: '#000000',
  },
  textValue: {
    fontWeight: 'bold',
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
