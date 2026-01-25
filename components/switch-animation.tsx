import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';

interface CustomSwitchProps {
    onToggle?: React.Dispatch<React.SetStateAction<boolean>>;
    labels: [string, string];
};

export default function CustomSwitch({ onToggle, labels }: CustomSwitchProps) {
    const [isOn, setIsOn] = React.useState<boolean>(false);
    const [animValue] = React.useState<Animated.Value>(new Animated.Value(1));

    const buttonLeft = () => {
        Animated.timing(animValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();

        // Simulate a delay for the switch to appear on the left
        setTimeout(() => {
            setIsOn(true);
        }, 500);
        onToggle && onToggle(isOn);
    };

    const buttonRight = () => {
        Animated.timing(animValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start();

        // Simulate a delay for the switch to appear on the right
        setTimeout(() => {
            setIsOn(false);
        }, 500);
        onToggle && onToggle(isOn);
    };

    const thumbTranslate = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['1%', '99%'],
    });

    return (
        <View style={styles.switchContainer}>
            <View style={styles.labelsContainer}>
                <TouchableWithoutFeedback onPress={buttonLeft}>
                    <Text style={[styles.labelText, isOn && styles.activeLabel]}>{labels[0]}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={buttonRight}>
                    <Text style={[styles.labelText, !isOn && styles.activeLabel]}>{labels[1]}</Text>
                </TouchableWithoutFeedback>
            </View>
            <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]} />
        </View>
    );
};

const borderRadius = 20;
const styles = StyleSheet.create({
    switchContainer: {
        width: "100%",
        height: 40,
        borderRadius: borderRadius,
        backgroundColor: '#E5E5E5',
        position: 'relative',
        justifyContent: 'center',
    },

    labelsContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 2,
    },
    labelText: {
        width: '50%',
        height: '100%',
        textAlign: 'center',
        alignContent: 'center', // for web
        textAlignVertical: 'center', // for Android

        fontSize: 12,
        color: Colors.light.tabIconDefault,
    },
    activeLabel: {
        color: Colors.light.tabIconSelected,
        fontWeight: 'bold',
    },

    thumb: {
        position: 'absolute',
        width: '50%',
        height: '90%',
        borderRadius: borderRadius,
        backgroundColor: '#fff',
        zIndex: 1,
        elevation: 10,
    },
});