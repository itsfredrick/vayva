import React from 'react';
import { Icon , Button } from '@vayva/ui';

export type Message = {
    id: string;
    sender: 'customer' | 'ai' | 'staff';
    text: string;
    time: string;
    product?: {
        name: string;
        price: string;
        image: string;
    };
    action?: {
        type: string;
        status: 'pending' | 'approved' | 'rejected';
    };
};

export function ChatTranscript({ messages }: { messages: Message[] }) {
    return (
        <div className="flex flex-col gap-4 p-4">
            {messages.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                return (
                    <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${isCustomer
                            ? 'bg-[#202c33] text-white rounded-tl-none'
                            : msg.sender === 'ai'
                                ? 'bg-[#005c4b] text-white rounded-tr-none border border-emerald-500/20'
                                : 'bg-[#2a3942] text-white rounded-tr-none border border-orange-500/20'
                            }`}>
                            {msg.sender !== 'customer' && (
                                <div className="text-[10px] font-bold mb-1 uppercase tracking-wider flex items-center gap-1 opacity-70">
                                    {msg.sender === 'ai' ? <><Icon name="Bot" size={10} /> AI Assistant</> : <><Icon name="User" size={10} /> Staff</>}
                                </div>
                            )}

                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                            {msg.product && (
                                <div className="mt-2 p-2 rounded bg-black/20 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-[10px]">IMG</div>
                                    <div>
                                        <div className="font-bold text-sm">{msg.product.name}</div>
                                        <div className="text-xs opacity-70">{msg.product.price}</div>
                                    </div>
                                    <Button size="sm" className="ml-auto h-7 text-xs">View</Button>
                                </div>
                            )}

                            <div className="text-[10px] text-white/40 text-right mt-1">{msg.time}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
