import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, User, LogOut, HelpCircle, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MenuScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#142210]">
            <View className="px-6 py-4 mb-4">
                <Text className="text-white font-bold text-2xl">Menu</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                <View className="bg-[#0b141a] rounded-2xl border border-white/5 overflow-hidden mb-6">
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-white/5">
                        <View className="w-12 h-12 rounded-full bg-indigo-500 items-center justify-center mr-4">
                            <Text className="text-white font-bold text-lg">JD</Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg">John Doe</Text>
                            <Text className="text-white/50 text-xs">Admin • TechDepot</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="bg-[#0b141a] rounded-2xl border border-white/5 overflow-hidden mb-6">
                    {[
                        { icon: User, label: 'Profile' },
                        { icon: Settings, label: 'Store Settings' },
                        { icon: FileText, label: 'Policies' },
                        { icon: HelpCircle, label: 'Help & Support' },
                    ].map((item, i) => (
                        <TouchableOpacity key={i} className="flex-row items-center p-4 border-b border-white/5 last:border-0 active:bg-white/5">
                            <item.icon size={20} color="rgba(255,255,255,0.7)" />
                            <Text className="text-white ml-4 font-medium text-base">{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => router.replace('/(auth)/login')}
                    className="flex-row items-center justify-center p-4 rounded-xl border border-red-500/20 bg-red-500/10 active:bg-red-500/20"
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-red-500 ml-2 font-bold">Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
