import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NotificationSystemType } from '@/types/noti';
import CustService from '@/service/custApi';

import { useDispatch } from 'react-redux';
import { ReduxTypes } from '@/store/reduxStore';
import { getCards } from '@/redux/reducerCard';



interface NotiModalProps {
    visible: boolean;
    onClose: () => void;
    notification: NotificationSystemType | null;
    onResponded?: () => void;
}

const NotiModal: React.FC<NotiModalProps> = ({ visible, onClose, notification, onResponded }) => {
    if (!notification) return null;

    const [loading, setLoading] = React.useState(false);
    const isFraud = notification.fraudPrediction === 'FRAUD';
    const isResponded = notification.customerResponse !== 'NO_RESPONSE';
    const dispatch: ReduxTypes['AppDispatch'] = useDispatch();

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await CustService.postConfirmTransaction(notification.id);
            onResponded && onResponded();
            onClose();
        } catch (e) {
            alert('Xác nhận thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await CustService.postRejectTransaction(notification.id);
            onResponded && onResponded();
            onClose();

            //goi api update redux
            const cards = await CustService.getCards();
            dispatch(getCards(cards.result.content));
        } catch (e) {
            alert('Từ chối thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Chi tiết thông báo</Text>
                    <Text style={styles.label}>Thời gian: <Text style={styles.value}>{notification.transactionTime}</Text></Text>
                    <Text style={styles.label}>Số tiền: <Text style={styles.value}>{notification.amount} {notification.currency}</Text></Text>
                    <Text style={styles.label}>Thẻ: <Text style={styles.value}>{notification.maskedPan}</Text></Text>
                    <Text style={styles.label}>Merchant: <Text style={styles.value}>{notification.merchantName}</Text></Text>
                    <Text style={styles.label}>Cảnh báo về: <Text style={styles.value}>{notification.fraudPrediction}</Text></Text>
                    <Text style={styles.label}>Mức độ rủi ro: <Text style={styles.value}>{notification.riskLevel}</Text></Text>
                    <Text style={styles.label}>Lý do: <Text style={styles.value}>{notification.fraudReason || '-'}</Text></Text>
                    <Text style={styles.label}>Trạng thái: <Text style={styles.value}>{notification.status}</Text></Text>
                    <Text style={styles.label}>Phản hồi: <Text style={styles.value}>{notification.customerResponse}</Text></Text>
                    <View style={styles.buttonRow}>
                        {!isResponded && (
                            <>
                                <TouchableOpacity style={[styles.button, styles.confirm]} onPress={handleConfirm} disabled={loading}>
                                    <Text style={styles.buttonText}>Xác nhận</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.reject]} onPress={handleReject} disabled={loading}>
                                    <Text style={styles.buttonText}>Từ chối</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={[styles.button, styles.close]} onPress={onClose}>
                            <Text style={styles.buttonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        minWidth: '92%',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        alignSelf: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 16,
        alignSelf: 'center',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginHorizontal: 8,
        marginTop: 12,
    },
    confirm: {
        backgroundColor: '#00D26A',
    },
    reject: {
        backgroundColor: '#FF4D4F',
    },
    close: {
        backgroundColor: '#888',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default NotiModal;
