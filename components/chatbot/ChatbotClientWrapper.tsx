// components/chatbot/ChatbotClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatbotWidget with ssr: false
const ChatbotWidget = dynamic(
  () => import('./ChatbotWidget'),
  {
    ssr: false,  // ✅ This is now allowed because we're in a Client Component
    loading: () => null,
  }
);

export default function ChatbotClientWrapper() {
  // Prevent hydration mismatch by not rendering anything on server
  if (typeof window === 'undefined') {
    return null;
  }

  return <ChatbotWidget />;
}