import { jsx as _jsx } from "react/jsx-runtime";
import { ChatRoom } from "../../../../components/chat/ChatRoom";
export default async function ChatRoomPage({ params, }) {
    const { id } = await params;
    return _jsx(ChatRoom, { conversationId: id });
}
