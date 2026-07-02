"use client";



import { Footer } from "@/components/layout/Footer";

import { Header } from "@/components/layout/Header";

import { FloatingQuoteButton } from "@/components/ui/FloatingQuoteButton";

import dynamic from "next/dynamic";

import { usePathname } from "next/navigation";



const QuoteAssistantWidget = dynamic(

  () =>

    import("@/components/quote-assistant/QuoteAssistantWidget").then(

      (m) => m.QuoteAssistantWidget

    ),

  { ssr: false }

);



export function SiteChrome({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");



  if (isDashboard) {

    return <>{children}</>;

  }



  return (

    <>

      <Header />

      <main id="main-content">{children}</main>

      <Footer />

      <FloatingQuoteButton />

      <QuoteAssistantWidget />

    </>

  );

}


