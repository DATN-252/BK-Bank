import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TouchableOpacity, StyleSheet, FlatList, Alert, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import CustService from "@/service/custApi";
import { getCards } from "@/redux/reducerCard";
import { Colors } from "@/constants/Colors";

import { useDispatch, useSelector } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';



export default function LockCardScreen() {
    const cardInfo = useSelector((state: ReduxTypes['RootState']) => state.cardInfo);
    const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

    const handleLockUnlock = async (card: any) => {
        try {
            // Gọi API khóa/mở khóa thẻ
            if (card.status === "ACTIVE") {
                await CustService.postLockCard(card.id);
                Alert.alert("Thành công", "Đã khóa thẻ!");
            } else {
                await CustService.postUnlockCard(card.id);
                Alert.alert("Thành công", "Đã mở khóa thẻ!");
            };

            // update list redux
            // const cards = await CustService.getCards();
            // dispatch(getCards(cards.result.content));
        } catch (err: any) {
            Alert.alert("Lỗi", err?.message || "Thao tác thất bại");
        };
    };

    const renderCard = ({ item }: { item: any }) => (
        <LinearGradient
            colors={item.status === "ACTIVE"
                ? ["#ccf8d6", "#f5f7fa"]
                : ["#fed8db", "#f5f7fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardModern}
        >
            <View style={styles.cardTopRow}>
                <View style={styles.iconCircle}>
                    <Ionicons
                        name={item.status === "ACTIVE" ? "lock-open-outline" : "lock-closed-outline"}
                        size={32}
                        color={item.status === "ACTIVE" ? '#4CD964' : '#FF3B30'}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <ThemedText style={styles.cardTitleModern}>{item.cardholderName}</ThemedText>
                    <ThemedText style={styles.cardNetworkModern}>{item.network}</ThemedText>
                </View>
                <TouchableOpacity
                    style={[styles.actionBtn, item.status === "ACTIVE" ? styles.buttonLock : styles.buttonUnlock]}
                    activeOpacity={0.85}
                    onPress={() => handleLockUnlock(item)}
                >
                    <Ionicons
                        name={item.status === "ACTIVE" ? "lock-closed" : "lock-open"}
                        size={18}
                        color="#fff"
                        style={{ marginRight: 4 }}
                    />
                    <ThemedText style={styles.actionBtnText}>{item.status === "ACTIVE" ? "Khóa" : "Mở"}</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                    <ThemedText style={styles.infoLabel}>Số thẻ</ThemedText>
                    <ThemedText style={styles.infoValue}>{item.maskedPan}</ThemedText>
                </View>
                <View style={styles.infoCol}>
                    <ThemedText style={styles.infoLabel}>Loại</ThemedText>
                    <ThemedText style={styles.infoValue}>{item.cardType}</ThemedText>
                </View>
                <View style={styles.infoCol}>
                    <ThemedText style={styles.infoLabel}>Hạn</ThemedText>
                    <ThemedText style={styles.infoValue}>{item.expirationDate}</ThemedText>
                </View>
                <View style={styles.infoCol}>
                    <ThemedText style={styles.infoLabel}>Trạng thái</ThemedText>
                    <ThemedText style={[styles.infoValue, { color: item.status === "ACTIVE" ? '#4CD964' : '#FF3B30', fontWeight: 'bold' }]}>{item.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}</ThemedText>
                </View>
            </View>
        </LinearGradient>
    );

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={cardInfo}
                keyExtractor={item => item.id?.toString()}
                renderItem={renderCard}
                ListEmptyComponent={<ThemedText>Không có thẻ nào</ThemedText>}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 14,
    },

    cardModern: {
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        shadowColor: '#4f8cff',
        shadowOpacity: 0.16,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
        borderWidth: 0,
        minHeight: 90,
        overflow: 'hidden',
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4f8cff',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitleModern: {
        fontWeight: '700',
        fontSize: 17,
        color: '#1a237e',
        letterSpacing: 0.2,
    },
    cardNetworkModern: {
        fontSize: 12,
        color: '#5c6bc0',
        marginTop: 2,
        fontWeight: '500',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 18,
        minWidth: 60,
        justifyContent: 'center',
        shadowColor: '#4f8cff',
        shadowOpacity: 0.13,
        shadowRadius: 4,
        elevation: 2,
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
    },
    buttonLock: {
        backgroundColor: 'rgba(255,59,48,0.92)',
    },
    buttonUnlock: {
        backgroundColor: 'rgba(76,217,100,0.92)',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
        gap: 8,
    },
    infoCol: {
        flex: 1,
        minWidth: 70,
        marginRight: 8,
        marginBottom: 2,
    },
    infoLabel: {
        fontSize: 11,
        color: '#607d8b',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 13,
        color: '#263238',
        fontWeight: '600',
    },
});