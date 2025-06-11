import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Exa Bytex - الأتمتة والتكامل، روبوتات المحادثة، والتسويق الرقمي",
  description: "نقدم حلول الأتمتة والتكامل، روبوتات المحادثة الذكية، والتسويق الرقمي المتقدم لتحويل أعمالك نحو المستقبل",
  keywords: "أتمتة، تكامل الأنظمة، روبوتات محادثة، تسويق رقمي، ذكاء اصطناعي",
  authors: [{ name: "Exa Bytex" }],
  openGraph: {
    title: "Exa Bytex - الأتمتة والتكامل، روبوتات المحادثة، والتسويق الرقمي",
    description: "حلول الأتمتة والتكامل، روبوتات المحادثة الذكية، والتسويق الرقمي المتقدم",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="ar" 
      dir="rtl" 
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body 
        className="antialiased font-sans bg-gradient-to-br from-slate-50 via-white to-slate-50"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
