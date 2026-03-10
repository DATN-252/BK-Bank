import { Animated, Dimensions, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./themed-view";

interface IndicatorProps {
    scrollX: Animated.Value,
    lengthData: number,
    sizeItem: number,
    _key: string,
};

export default function Indicator({ scrollX, lengthData, sizeItem, _key }: IndicatorProps) {
    const extrapolate = 'clamp';
    const screenWidth = Dimensions.get('window').width;
    const totalContentWidth = lengthData * sizeItem;
    const maxScrollX = Math.max(totalContentWidth - screenWidth, 1);

    const currentIndex = scrollX.interpolate({
        inputRange: [0, maxScrollX],
        outputRange: [0, lengthData - 1],
        extrapolate,
    });

    return (
        <ThemedView style={styles.indicatorContainer} key={_key}>
            {Array.from({ length: lengthData }, (_, index) => {
                // inputRange phải bắt đầu từ 0
                const inputRange = [
                    index - 1,
                    index,
                    Math.min(index + 1, lengthData - 1),
                ];

                // tỉ lệ height các dot
                const scale = currentIndex.interpolate({
                    inputRange,
                    outputRange: [1, 1, 1],
                    extrapolate,
                });

                // tỉ lệ width các dot
                const width = currentIndex.interpolate({
                    inputRange,
                    outputRange: [6, 16, 6],
                    extrapolate,
                });

                const bgColor = currentIndex.interpolate({
                    inputRange,
                    outputRange: [Colors.light.tint, Colors.light.icon, Colors.light.tint],
                    extrapolate,
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.indicator,
                            {
                                transform: [{ scale }],
                                width,
                                backgroundColor: bgColor,
                            }
                        ]} />
                );
            })}
        </ThemedView >
    );
};

const styles = StyleSheet.create({
    indicatorContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        height: 6,
        backgroundColor:'transparent',
    },

    indicator: {
        height: 6,
        borderRadius: 6,
        marginHorizontal: 4,
    },
});