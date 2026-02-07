/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2567F9';
const tintColorDark = '#1E00FF';
const warningColor = '#FF3B30';

export const Colors = {
  light: {
    text: '#ffffff',
    background: '#ffffff32',
    borderColor: '#0000002f',
    tint: tintColorLight,
    icon: '#ffffff',
    backgroundIcon: '#4643A1',
    tabIconDefault: '#000000',
    tabIconSelected: tintColorDark,
    warning: warningColor,
  },
  dark: {
    text: '#ECEDEE',
    background: '#000000',
    borderColor: '#ffffff55',
    tint: tintColorDark,
    icon: '#ffffff53',
    tabIconDefault: '#ffffff53',
    tabIconSelected: tintColorDark,
    warning: warningColor,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
