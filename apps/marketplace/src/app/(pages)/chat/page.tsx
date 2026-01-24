import React from "react";
import { ChatInbox } from "../../../components/chat/ChatInbox";

export default function ChatPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-100 py-4 px-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900 max-w-2xl mx-auto">Messages</h1>
            </header>
            <main className="flex-1 max-w-2xl mx-auto w-full p-4">
                <ChatInbox />
            </main>
        </div>
    );
}
