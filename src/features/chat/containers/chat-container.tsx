import { useNavigate } from "react-router-dom";

import { ChatEmptyState } from "../components/chat-empty-state";
import { ChatHeader } from "../components/chat-header";
import { ChatInputBar } from "../components/chat-input-bar";
import { ChatMessageList } from "../components/chat-message-list";
import { useChat } from "../hooks/use-chat";

export function ChatContainer() {
  const navigate = useNavigate();
  const { messages, isEmpty, isPending, sendMessage } = useChat();

  return (
    <div className="flex h-dvh flex-col bg-white">
      <ChatHeader onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <ChatEmptyState onSelectFaq={sendMessage} />
        ) : (
          <ChatMessageList messages={messages} isPending={isPending} />
        )}
      </main>

      <ChatInputBar onSend={sendMessage} disabled={isPending} />
    </div>
  );
}
