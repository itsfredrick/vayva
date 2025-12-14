import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, Check, X, MessageCircle } from 'lucide-react-native';
import { styled } from 'nativewind';
import { BlurView } from 'expo-blur';

const StyledBlurView = styled(BlurView);

const APPROVALS = [
    {
        id: 1,
        type: 'refund',
        title: 'Refund Request',
        desc: 'Customer requesting refund for Order #8821 due to damaged package.',
        risk: 'Medium',
        amount: '₦ 45,000',
        chatSnippet: "It arrived broken. I want my money back please.",
        customer: 'Amaka O.'
    },
    {
        id: 2,
        type: 'discount',
        title: 'Discount Inquiry',
        desc: 'Customer asking for discount on bulk purchase.',
        risk: 'Low',
        amount: '5% Off',
        chatSnippet: "I'm buying 10 units. Can I get a discount?",
        customer: 'Sarah K.'
    },
];

export default function ApprovalsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#142210]">
            <View className="px-6 py-4">
                <Text className="text-white font-bold text-2xl mb-2">Pending Approvals</Text>
                <Text className="text-white/50 text-sm mb-6">WhatsApp AI requires your input on these items.</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>
                {APPROVALS.map((item) => (
                    <View key={item.id} className="bg-[#0b141a] border border-white/10 rounded-3xl overflow-hidden mb-6 shadow-xl shadow-black/50">

                        {/* Header */}
                        <View className="p-4 border-b border-white/5 flex-row justify-between items-start bg-white/5">
                            <View className="flex-row gap-3">
                                <View className={`w-10 h-10 rounded-full items-center justify-center ${item.type === 'refund' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                    <ShoppingBag size={18} color={item.type === 'refund' ? '#ef4444' : '#3b82f6'} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">{item.title}</Text>
                                    <Text className="text-white/50 text-xs">{item.customer}</Text>
                                </View>
                            </View>
                            <View className={`px-2 py-1 rounded border ${item.risk === 'High' ? 'bg-red-500/10 border-red-500/20' :
                                    item.risk === 'Medium' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-green-500/10 border-green-500/20'
                                }`}>
                                <Text className={`text-[10px] font-bold uppercase ${item.risk === 'High' ? 'text-red-400' :
                                        item.risk === 'Medium' ? 'text-orange-400' : 'text-green-400'
                                    }`}>{item.risk} Risk</Text>
                            </View>
                        </View>

                        {/* Content */}
                        <View className="p-6">
                            <Text className="text-white text-lg font-bold mb-4">{item.amount}</Text>

                            <View className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <MessageCircle size={14} color="rgba(255,255,255,0.5)" />
                                    <Text className="text-white/50 text-xs uppercase font-bold">Latest Message</Text>
                                </View>
                                <Text className="text-white/80 italic">"{item.chatSnippet}"</Text>
                            </View>

                            <Text className="text-white/60 text-sm mb-6 leading-5">{item.desc}</Text>

                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl items-center flex-row justify-center gap-2">
                                    <X size={18} color="#ef4444" />
                                    <Text className="text-white font-bold">Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-[#46EC13] py-3 rounded-xl items-center flex-row justify-center gap-2 shadow-lg shadow-green-500/20">
                                    <Check size={18} color="#000" />
                                    <Text className="text-black font-bold">Approve</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
