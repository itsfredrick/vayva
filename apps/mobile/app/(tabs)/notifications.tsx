import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CreditCard, Truck } from 'lucide-react-native';

const NOTIFICATIONS = [
    { id: 1, title: 'Payment Received', desc: 'Order #8824 was paid successfully.', time: '10m', type: 'payment' },
    { id: 2, title: 'New Order', desc: 'You have a new order from Amaka.', time: '1h', type: 'order' },
    { id: 3, title: 'Delivery Updated', desc: 'Rider is on the way to pick up #8822.', time: '2h', type: 'delivery' },
];

export default function NotificationsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#142210]">
            <View className="px-6 py-4">
                <Text className="text-white font-bold text-2xl mb-6">Alerts</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                {NOTIFICATIONS.map(n => (
                    <View key={n.id} className="flex-row gap-4 mb-6 border-b border-white/5 pb-6 last:border-0">
                        <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/10">
                            {n.type === 'payment' ? <CreditCard size={18} color="#46EC13" /> :
                                n.type === 'delivery' ? <Truck size={18} color="#3b82f6" /> :
                                    <Bell size={18} color="#f59e0b" />}
                        </View>
                        <View className="flex-1">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-white font-bold text-base">{n.title}</Text>
                                <Text className="text-white/30 text-xs">{n.time}</Text>
                            </View>
                            <Text className="text-white/60 text-sm leading-5">{n.desc}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
