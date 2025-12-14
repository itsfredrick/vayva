import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, TrendingUp, Package, Clock, AlertTriangle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { styled } from 'nativewind';

const StyledBlurView = styled(BlurView);

const METRICS = [
    { label: "Today's Revenue", value: '₦ 450,000', change: '+12%', icon: TrendingUp, color: 'text-[#46EC13]', bg: 'bg-[#46EC13]/10' },
    { label: "New Orders", value: '24', change: '+5', icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

const ALERTS = [
    { id: 1, title: 'Approval Needed', desc: 'WhatsApp AI suggests refund for Order #8821', type: 'warning' },
    { id: 2, title: 'Payout Failed', desc: 'Bank rejected transfer of ₦150k', type: 'danger' },
];

const RECENT_ORDERS = [
    { id: '8824', customer: 'Amaka O.', items: '2 items', total: '₦ 45,000', status: 'Paid', time: '10 min ago' },
    { id: '8823', customer: 'John D.', items: '1 item', total: '₦ 12,500', status: 'Pending', time: '1 hour ago' },
    { id: '8822', customer: 'Sarah K.', items: '3 items', total: '₦ 85,000', status: 'Processing', time: '2 hours ago' },
];

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#142210]">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/10">
                            <Text className="text-white font-bold text-lg">T</Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">TechDepot</Text>
                            <Text className="text-white/50 text-xs">Lagos, NG</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
                        <Bell size={20} color="white" />
                        <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </TouchableOpacity>
                </View>

                {/* Metrics Strip */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }} className="mt-4">
                    {METRICS.map((m, i) => (
                        <View key={i} className="w-[160px] h-[100px] bg-[#0b141a]/50 rounded-2xl p-4 border border-white/5 justify-between">
                            <View className="flex-row justify-between items-start">
                                <View className={`w-8 h-8 rounded-full ${m.bg} items-center justify-center`}>
                                    <m.icon size={16} className={m.color} />
                                </View>
                                <Text className="text-green-400 text-xs font-bold">{m.change}</Text>
                            </View>
                            <View>
                                <Text className="text-white font-bold text-xl">{m.value}</Text>
                                <Text className="text-white/50 text-xs">{m.label}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Alerts */}
                <View className="px-6 mt-8">
                    <Text className="text-white font-bold text-lg mb-4">Action Required</Text>
                    {ALERTS.map((alert) => (
                        <StyledBlurView key={alert.id} intensity={10} tint="dark" className="flex-row items-center gap-4 p-4 rounded-2xl border border-white/10 mb-3 overflow-hidden">
                            <View className={`w-10 h-10 rounded-full ${alert.type === 'danger' ? 'bg-red-500/10' : 'bg-orange-500/10'} items-center justify-center`}>
                                <AlertTriangle size={20} color={alert.type === 'danger' ? '#ef4444' : '#f97316'} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-sm">{alert.title}</Text>
                                <Text className="text-white/60 text-xs" numberOfLines={1}>{alert.desc}</Text>
                            </View>
                            <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                        </StyledBlurView>
                    ))}
                </View>

                {/* Recent Orders */}
                <View className="px-6 mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white font-bold text-lg">Recent Orders</Text>
                        <TouchableOpacity>
                            <Text className="text-[#46EC13] text-sm font-bold">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {RECENT_ORDERS.map((order) => (
                        <View key={order.id} className="bg-[#0b141a]/50 border border-white/5 rounded-2xl p-4 mb-3 flex-row justify-between items-center">
                            <View className="flex-row gap-4 items-center">
                                <View className="w-12 h-12 bg-white/5 rounded-xl items-center justify-center">
                                    <Package size={20} color="rgba(255,255,255,0.5)" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">#{order.id} • {order.customer}</Text>
                                    <Text className="text-white/50 text-xs">{order.items} • {order.time}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-base">{order.total}</Text>
                                <View className={`px-2 py-0.5 rounded-full mt-1 ${order.status === 'Paid' ? 'bg-green-500/10' :
                                        order.status === 'Pending' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                                    }`}>
                                    <Text className={`text-[10px] font-bold ${order.status === 'Paid' ? 'text-green-400' :
                                            order.status === 'Pending' ? 'text-yellow-400' : 'text-blue-400'
                                        }`}>{order.status}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
