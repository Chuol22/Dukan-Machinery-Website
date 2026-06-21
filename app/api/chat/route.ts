import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { machinesData } from "@/data/machinesData";
import faqData from "@/data/chatbot-knowledge.json";
import { getRagContext } from "@/lib/geminiRag";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages parameter" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key is missing or is placeholder value
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      console.error("❌ GEMINI_API_KEY is not configured properly.");
      console.error("🔧 Setup instructions:");
      console.error("   1. Visit: https://aistudio.google.com/app/apikey");
      console.error("   2. Create a free API key");
      console.error("   3. Add to .env: GEMINI_API_KEY=your_actual_key");
      console.error("   4. Restart the dev server");
      
      return NextResponse.json({
        reply: "⚠️ **AI Service Not Configured**\n\nThe AI assistant requires a Gemini API key to function.\n\n**Admin Setup Required:**\n1. Get free API key: [Google AI Studio](https://aistudio.google.com/app/apikey)\n2. Add to `.env`: `GEMINI_API_KEY=your_key`\n3. Restart server\n\n📞 **Need Help Now?** Contact our team:\n- Email: admin@dukanmachinery.com\n- Phone: +251-XXX-XXXX\n- Visit: /contact page"
      });
    }

    // Assemble RAG context (static docs + DB data)
    const ragContext = await getRagContext();

    const systemPrompt = `You are a professional, helpful AI assistant for Dukan Machinery (DKM) - Ethiopia's leading industrial machinery manufacturer.

## YOUR KNOWLEDGE BASE:
${ragContext}

## YOUR ROLE:
You help customers understand DKM's products, services, ordering process, and company information.

## COMMUNICATION STYLE:
- Professional yet friendly and approachable
- Clear, concise answers
- Use emojis sparingly (1-2 per response for visual appeal)
- Always format responses with markdown for readability
- Respond in the user's language

## INSTRUCTIONS:

### 1. PRODUCT INQUIRIES:
- When asked about machines, provide EXACT specifications from the catalog
- Include: capacity, power, dimensions, price, features, and applications
- Mention if it's available for custom modifications
- Suggest related machines when relevant

### 2. PRICING & ORDERING:
- For specific machine prices, check the catalog (some show "Request Price")
- Guide users to the Order page for quotes
- Explain the order process: inquiry → review → quotation → acceptance → delivery
- Mention payment methods: Bank Transfer, Cash on Delivery (for Ethiopia)

### 3. CUSTOM SOLUTIONS:
- DKM offers custom machinery design and fabrication
- Explain the custom order process from the documentation
- Direct users to submit custom order inquiries via the Order page

### 4. COMPANY & PLATFORM:
- Use company information from the documentation
- Explain features: order tracking, admin dashboard, email notifications
- Guide users to relevant pages: /machines, /order, /contact, /about

### 5. CANNOT ANSWER:
If you don't have information in your knowledge base:
- Be honest: "I don't have specific details about that"
- Direct to: "Please contact our sales team at [contact info from docs]"
- Suggest: "Visit our Contact page or call us for detailed information"

### 6. RESPONSE FORMAT:
- Use **bold** for emphasis
- Use bullet points for lists
- Include relevant specs in a clear format
- End with a helpful call-to-action when appropriate

Remember: Accuracy is crucial. Only provide information from your knowledge base. Never invent specifications, prices, or capabilities.
`;

    // Combine system prompt with recent user messages for Gemini
    const userConversation = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");
    const fullPrompt = `${systemPrompt}\nUser conversation:\n${userConversation}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    
    let result;
    try {
      result = await model.generateContent(fullPrompt);
    } catch (apiError: any) {
      console.error("❌ Gemini API Error:", apiError);
      
      // Handle specific API errors
      if (apiError?.message?.includes("API_KEY_INVALID") || apiError?.status === 400) {
        return NextResponse.json({
          reply: "⚠️ **Invalid API Key**\n\nThe configured Gemini API key is invalid.\n\n**Admin Action Required:**\n1. Verify API key at: [Google AI Studio](https://aistudio.google.com/app/apikey)\n2. Update `.env` with valid key\n3. Restart server\n\n📞 Contact support if issue persists."
        });
      }
      
      if (apiError?.message?.includes("quota") || apiError?.status === 429) {
        return NextResponse.json({
          reply: "⚠️ **API Quota Exceeded**\n\nThe AI service has reached its request limit.\n\n**Solutions:**\n- Wait a few minutes and try again\n- Contact admin to upgrade API quota\n\n📞 Need immediate help? Contact our team directly."
        });
      }
      
      // Generic API error
      throw apiError;
    }
    
    const reply = result.response?.text?.() || "Sorry, I couldn't process your request.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    
    return NextResponse.json({
      reply: "⚠️ **Service Temporarily Unavailable**\n\nI'm having trouble processing your request right now.\n\n**What you can do:**\n- Try again in a moment\n- Browse our [Machines Catalog](/machines)\n- Contact us directly: [Contact Page](/contact)\n\n**Technical Details:** " + (error?.message || "Unknown error")
    }, { status: 500 });
  }
}
