'use client';

// ChatbotClientWrapper — client-side dynamic loader for chatbot widget
import dynamic from 'next/dynamic';

// Lazy-load widget to avoid SSR hydration issues
const ChatbotWidget = dynamic(
  () => import('./ChatbotWidget'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ChatbotClientWrapper() {
  return <ChatbotWidget />;
}
