import { Animated, FlatList, StyleSheet, TouchableOpacity, Dimensions, ImageSourcePropType } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

import { BackgroundView } from '@/components/background-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';

import { useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import Indicator from '@/components/Indicator';

const images: { [key: string]: ImageSourcePropType } = {
  visa: require('@/assets/images/VISA.png'),
  mastercard: require('@/assets/images/MASTERCARD.png'),
  napas: require('@/assets/images/NAPAS.png'),
};

export default function HomeScreen() {
  const [showInfoCard, setShowInfoCard] = React.useState<boolean>(false);

  const userInfo = useSelector((state: ReduxTypes['RootState']) => state.userInfo);
  const cardInfo = useSelector((state: ReduxTypes['RootState']) => state.cardInfo);
  const { width: screenWidth } = Dimensions.get('window');
  const scrollXBanner: Animated.Value = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  return (
    <BackgroundView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>

          <ThemedView style={styles.header}>
            <ThemedText type='subtitle' style={styles.textHeader}>Xin chào</ThemedText>
            <ThemedText type='title' style={styles.textHeader}>{userInfo?.fullName}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.body}>
            {/* //todo ở đây đang lấy creditcard, sau này list có debit thì phải sửa lại */}
            <FlatList
              data={cardInfo}
              style={{ height: '35%' }}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollXBanner } } }],
                { useNativeDriver: false }
              )}
              renderItem={({ item }) => (
                <ThemedView style={{ width: screenWidth, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                  <ThemedView style={styles.infoCard}>
                    <ThemedView style={styles.cardHeader}>
                      <ThemedText style={{ opacity: 0.6 }}>
                        {item.cardType === 'CREDIT' ? 'Hạn mức còn lại' : 'Số dư hiện tại'}
                      </ThemedText>

                      {showInfoCard ? (
                        <TouchableOpacity onPress={() => setShowInfoCard(false)}>
                          <FontAwesome name="eye-slash" size={24} color={Colors.light.icon} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => setShowInfoCard(true)}>
                          <FontAwesome name="eye" size={24} color={Colors.light.icon} />
                        </TouchableOpacity>
                      )}
                    </ThemedView>

                    <ThemedText
                      type="title"
                      style={styles.textHeader}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {showInfoCard
                        ? item.cardType === 'CREDIT'
                          ? (item.creditLimit - item.outstandingBalance).toLocaleString() + " USD"
                          : item.outstandingBalance.toLocaleString() + " USD"
                        : "***********"}
                    </ThemedText>

                    <ThemedText style={styles.textCard}>
                      {showInfoCard ? item.maskedPan : "**** **** **** ****"}
                    </ThemedText>

                    <ThemedView style={styles.cardFooter}>
                      <ThemedText style={styles.textCard}>
                        {showInfoCard
                          ? item.expirationDate.slice(5).replace("-", "/")
                          : "**/**"}
                      </ThemedText>

                      <Image
                        source={images[item.network.toLowerCase()]}
                        style={{ width: '15%', aspectRatio: 1, resizeMode: 'contain' }}
                      />
                    </ThemedView>

                  </ThemedView>
                </ThemedView>
              )}
            />
            <Indicator scrollX={scrollXBanner} lengthData={cardInfo.length} key={'banner'} _key={'banner'} sizeItem={screenWidth} />

            <ThemedView style={styles.utilities}>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity
                  style={styles.iconBackground}
                  onPress={() => router.push('/transaction')}
                >
                  <AntDesign name="user-switch" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
                <ThemedText style={styles.textUtil}>Chuyển tiền</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity
                  style={styles.iconBackground}
                  onPress={() => { router.push('/qr') }}
                >
                  <AntDesign name="scan" size={24} color={Colors.light.icon} />
                </TouchableOpacity>
                <ThemedText style={styles.textUtil}>Mã QR</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity style={styles.iconBackground} onPress={() => router.push('/future')}><AntDesign name="wallet" size={24} color={Colors.light.icon} /></TouchableOpacity>
                <ThemedText style={styles.textUtil}>Mở thẻ</ThemedText>
              </ThemedView>
              <ThemedView style={styles.utilitiesItem}>
                <TouchableOpacity style={styles.iconBackground} onPress={() => { router.push('/utilities') }}><AntDesign name="ellipsis" size={24} color={Colors.light.icon} /></TouchableOpacity>
                <ThemedText style={styles.textUtil}>Khác</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

        </ThemedView>
      </ThemedView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },

  header: {
    width: '90%',
    height: '20%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  textHeader: {
    color: Colors.light.text,
    lineHeight: 35,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },

  body: {
    backgroundColor: 'transparent',
    width: '100%',
  },

  infoCard: {
    paddingHorizontal: '5%',
    width: '90%',
    height: '90%',
    borderRadius: 10,
    justifyContent: 'space-evenly',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textCard: {
    letterSpacing: 2,
  },

  utilities: {
    marginTop: 40,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  utilitiesItem: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '25%',
    alignItems: 'center'
  },
  iconBackground: {
    backgroundColor: Colors.light.backgroundIcon,
    borderRadius: 100,
    width: '50%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textUtil: {
    fontSize: 12
  },
});
