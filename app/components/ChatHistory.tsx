import { ChatMessage } from '@/app/components/ChatMessage';
import { Message } from 'ai';


type ChatHistoryProps = {
  messages: Message[];
  isLoading?: boolean;
};

export function ChatHistory({ messages, isLoading = false }: ChatHistoryProps) {

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          role={message.role}
          timestamp={message.createdAt}
        />
      ))}
      {isLoading && (
        <ChatMessage
          content="..."
          role="assistant"
          timestamp={new Date()}
          isLoading={true}
        />
      )}
    </div>
  );
} 