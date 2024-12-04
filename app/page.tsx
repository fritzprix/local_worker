'use client';

import { useChat } from 'ai/react';
import { ChatHistory } from '@/app/components/ChatHistory';
import { ChatInput } from '@/app/components/ChatInput';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 10
  });

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <header className="border-b bg-white">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-center">AI Chat Assistant</h1>
        </div>
      </header>

      <main className="overflow-hidden container py-4">
        <ChatHistory messages={messages} />
      </main>

      <footer className="border-t bg-white">
        <div className="container py-4">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </footer>
    </div>
  );
}
