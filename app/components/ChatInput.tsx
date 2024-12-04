import { ChangeEvent, FormEvent } from 'react';

type ChatInputProps = {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        name="message"
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        value={input}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
      >
        Send
      </button>
    </form>
  );
} 