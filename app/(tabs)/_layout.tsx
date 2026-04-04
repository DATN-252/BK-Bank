import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/use-color-scheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemedView } from '@/components/themed-view';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveTintColor: Colors['light'].tabIconDefault,
        tabBarActiveTintColor: Colors['light'].tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      backBehavior='history'
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="utilities"
        options={{
          title: 'Tiện ích',
          tabBarIcon: ({ color }) => <FontAwesome name="th-large" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          tabBarLabel: () => <></>,
          tabBarIcon: ({ color }) => (
            <ThemedView
              style={{
                width: '180%',
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: Colors.light.icon,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                // Web shadow
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 6,
                // Android shadow 
                elevation: 3,
                borderColor: Colors.light.borderColor,
                borderWidth: 1,
              }}
            >
              <MaterialIcons
                name="qr-code-scanner"
                size={40}
                color={color}
              />
            </ThemedView>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <FontAwesome name="bell" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Thông tin',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
