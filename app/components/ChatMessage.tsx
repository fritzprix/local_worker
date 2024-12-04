import { Message } from "ai";

type ChatMessageProps = {
  content: string;
  role: Message['role'];
  timestamp?: Date;
  isLoading?: boolean;
};

export function ChatMessage({ content, role, timestamp, isLoading }: ChatMessageProps) {
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }) : null;

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          role === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
        {formattedTime && (
          <span className="text-xs opacity-70 mt-2 block" suppressHydrationWarning>
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
} 