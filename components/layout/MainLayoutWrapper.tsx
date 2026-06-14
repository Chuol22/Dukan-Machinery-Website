"use client";

// Public page shell — wraps pages with header/footer; admin routes render bare
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ChatbotClientWrapper from "@/components/chatbot/ChatbotClientWrapper";
import FloatingSocial from "@/components/social/FloatingSocial";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin pages skip public chrome (navbar, footer, chatbot)
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20 min-h-screen">{children}</main>
      <Footer />
      <ScrollToTop />
      <ChatbotClientWrapper />
      <FloatingSocial />
    </>
  );
}
