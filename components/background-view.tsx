import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

type BackgroundViewProps = Omit<LinearGradientProps, 'colors'> & {
    colors?: readonly [string, string, ...string[]];
    children?: ReactNode;
};
export function BackgroundView({
    colors = ['#36ADFF', '#030391'],
    start = { x: 0, y: 0 },
    end = { x: 0, y: 1 },
    style,
    children,
    ...props
}: BackgroundViewProps) {
    // todo: có thể fetch api

    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={[StyleSheet.absoluteFill, style]}
            {...props}
        >
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    {children}
                </SafeAreaView>
            </SafeAreaProvider>
        </LinearGradient>
    );
}
