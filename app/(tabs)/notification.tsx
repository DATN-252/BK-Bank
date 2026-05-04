import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import NotiModal from '@/components/Noti-modal';

import { BackgroundView } from '@/components/background-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import CustService from '@/service/custApi';
import { addAllNoti, NotiBalance, removeAllNoti } from '@/redux/reducerNoti';
import { NotificationSystemType } from '@/types/noti';

import { useDispatch, useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';



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
    id: '1001',
    icon: 'gift',
    title: 'Khuyến mãi mở thẻ',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '1002',
    icon: 'wrench',
    title: 'Bảo trì hệ thống 20/12',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '1003',
    icon: 'credit-card',
    title: 'Hướng dẫn mở số tk',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '1004',
    icon: 'upload',
    title: 'Nâng cấp hệ thống',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
  {
    id: '1005',
    icon: 'shield',
    title: 'Yêu cầu bật xác thực 2 lớp',
    date: '5 Oct 2020',
    link: 'Xem thêm',
  },
];

export default function NotificationScreen() {
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState<'balance' | 'general'>('balance');

  // để thay dổi nền mỗi transaction
  const getStatusReceiveOrSendMoney = (transactionType: string) => {
    const validTypes = new Set(['CHARGE', 'WITHDRAWAL']);
    return validTypes.has(transactionType);
  };

  // để thay dổi nền mỗi transaction
  const getBalanceRowBackground = (transaction: NotiBalance) => {
    if (transaction.status === 'SUCCESS') {
      return getStatusReceiveOrSendMoney(transaction.transactionType) ? '#FFEDEE' : '#EDFCF2';
    }
    return '#faf1cc';
  };

  // để thay dổi nền mỗi transaction hệ thống
  const getGeneralRowBackground = (item: NotificationSystemType | (typeof DATA_GENERAL)[number]) => {
    if ('fraudPrediction' in item && item.customerRespondedAt === null) {
      return '#FFF8D9';
    }

    return Colors.light.icon;
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const DATA_BALANCE: NotiBalance[] = useSelector((state: ReduxTypes['RootState']) => state.notification);
  // cho viec xoa hoac readed
  const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

  const refreshNotificationsBalance = React.useCallback(async () => {
    setRefreshing(true);

    try {
      // xóa hết thông báo cũ đi rồi thêm thông báo mới vào
      dispatch(removeAllNoti());

      const data = await CustService.getNotiBalance();

      dispatch(addAllNoti(data.result.content));
    } catch (err) {
      // console.log(err);
      alert('Lấy thông báo thất bại!');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    refreshNotificationsBalance();
  }, [refreshNotificationsBalance]);

  const [DATA_SYSTEM, setDATA_SYSTEM] = React.useState<NotificationSystemType[]>([]);
  const refreshNotificationsSystem = React.useCallback(async () => {
    setRefreshing(true);

    try {
      // xóa hết thông báo cũ đi rồi thêm thông báo mới vào
      // dispatch(removeAllNoti());

      const data = await CustService.getNotiFraud();
      setDATA_SYSTEM(data.result);
      // dispatch(addAllNoti(data.result));
    } catch (err) {
      // console.log(err);
      alert('Lấy thông báo thất bại!');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    refreshNotificationsSystem();
  }, [refreshNotificationsSystem]);


  const renderBalanceItem = ({ item }: { item: NotiBalance }) => {
    const transType: boolean = !getStatusReceiveOrSendMoney(item.transactionType);

    return (<ThemedView style={[styles.row, { backgroundColor: getBalanceRowBackground(item) }]}>
      <ThemedView style={styles.iconBox}>
        <FontAwesome
          name={item.status === 'SUCCESS' ? (transType ? 'arrow-circle-up' : 'arrow-circle-down') : 'exclamation-triangle'}
          size={24}
          color={item.status === 'SUCCESS' ? (transType ? '#00D26A' : 'red') : 'orange'}
        />
      </ThemedView>
      <ThemedView style={{ flex: 1, backgroundColor: 'transparent', }}>
        <ThemedText style={styles.textKey}>Thông báo tới:
          <ThemedText style={styles.textValue}> {item.accountNumber}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>Loại tài khoản:
          <ThemedText style={styles.textValue}> {item.accountType}</ThemedText>
        </ThemedText>
        {item.merchantId != null && (
          <ThemedText style={styles.textKey}>Thanh toán đến:
            <ThemedText style={styles.textValue}> {item.merchantName}</ThemedText>
          </ThemedText>
        )}
        <ThemedText style={styles.textKey}>Nội dung:
          <ThemedText style={styles.textValue}> {`"${item.description}"`}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>{item.accountType === 'LOAN' ? 'Số nợ cuối:' : 'Số dư cuối:'}
          <ThemedText style={styles.textValue}> {(item.balanceAfter ?? 0).toFixed(2)} {item.currency}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.textKey}>{item.transactionDate?.split("T")[0] || "N/A"} | Trạng thái: {item.status}</ThemedText>
      </ThemedView>
      <ThemedText style={[styles.amount, { color: transType ? '#00D26A' : 'red' }]}>{transType ? "+" : "-"}{(item.amount ?? 0).toFixed(2)} {item.currency}</ThemedText>
    </ThemedView>
    );
  }

  // Modal state for system notification detail
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedSystemNoti, setSelectedSystemNoti] = React.useState<NotificationSystemType | null>(null);

  // General notification item renderer that supports both DATA_GENERAL and DATA_SYSTEM
  const renderGeneralItem = ({ item }: { item: any }) => {
    // If is system notification (fraud/system), show modal on press
    const isSystem = 'fraudPrediction' in item;
    const icon = item.icon || 'exclamation-triangle';
    const color = isSystem ? 'orange' : Colors.light.tint;
    const title = item.title || item.message || item.content || (item.fraudPrediction ? 'Cảnh báo gian lận' : 'Thông báo hệ thống');
    const date = item.date || item.createdAt || item.time || '';

    const content = (
      <ThemedView style={[styles.row, { backgroundColor: getGeneralRowBackground(item) }]}>
        <ThemedView style={styles.iconBox}>
          <FontAwesome name={icon} size={24} color={color} />
        </ThemedView>
        <ThemedView style={{ flex: 1, backgroundColor: 'transparent', }}>
          <ThemedText style={styles.textValue}>{title}</ThemedText>
          <ThemedText style={styles.textKey}>{date}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.link}>Xem thêm</ThemedText>
      </ThemedView>
    );

    if (isSystem) {
      return (
        <TouchableOpacity onPress={() => { setSelectedSystemNoti(item); setModalVisible(true); }}>
          {content}
        </TouchableOpacity>
      );
    }
    return <TouchableOpacity>{content}</TouchableOpacity>;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <BackgroundView>
        <ThemedView style={styles.container}>
          <ThemedText type='subtitle' style={styles.title}>Thông báo</ThemedText>

          <ThemedView style={styles.searchBox}>
            <FontAwesome name="search" size={20} color={Colors.light.icon} style={{ marginRight: 8 }} />
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
              onRefresh={refreshNotificationsBalance}
            />
          ) : (
            <>
              <FlatList
                data={[...DATA_SYSTEM, ...DATA_GENERAL]}
                keyExtractor={item => item.id?.toString?.() || item.id || Math.random().toString()}
                renderItem={renderGeneralItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing} // hiện ui loading
                onRefresh={refreshNotificationsSystem}
              />
              <NotiModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                notification={selectedSystemNoti}
                onResponded={() => refreshNotificationsSystem()}
              />
            </>
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
    color: Colors.light.text,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
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
