// chatbot-ai.ts — keyword-based chatbot responses
import chatbotData from "@/data/chatbot-knowledge.json";

interface KnowledgeItem {
  keywords: string[];
  response: string;
}

interface ChatbotData {
  knowledge: KnowledgeItem[];
}

// Match user input against greetings, thanks, and knowledge base
export function getAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  const chatbotKnowledge = (chatbotData as ChatbotData).knowledge;

  if (message.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! 👋 Welcome to Dukan Machinery. I'm here to help you with our industrial machinery solutions. What would you like to know about?\n\n**Quick options:**\n• Machine specifications\n• Pricing information\n• Custom orders\n• Support & warranty";
  }

  if (message.match(/thank|thanks|appreciate/)) {
    return "You're welcome! 😊 Is there anything else I can help you with? I'm here 24/7 to assist with your machinery needs.";
  }

  for (const item of chatbotKnowledge) {
    if (item.keywords.some((keyword: string) => message.includes(keyword))) {
      return item.response;
    }
  }

  return "Thank you for your interest in Dukan Machinery! 🏭\n\nTo better assist you, could you please:\n\n1. **Specify the machine type** (poultry feed, animal feed, etc.)\n2. **Share your required capacity** (in tons/hour)\n3. **Mention if you need standard or custom solution**\n\nAlternatively, you can:\n• **Call us**: +251 912 713 823\n• **Email**: sales@dukanmachinery.com\n• **WhatsApp**: Click the button below\n\nHow can I help you today?";
}
