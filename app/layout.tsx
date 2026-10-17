import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Manrope, Parisienne, Playfair_Display, Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { LangProvider } from "@/lib/i18n";
import { site } from "@/lib/site";

const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const script = Parisienne({ weight: "400", subsets: ["latin"], variable: "--font-parisienne", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const kufi = Reem_Kufi({ subsets: ["arabic"], variable: "--font-reem", display: "swap" });
const ruqaa = Aref_Ruqaa({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-ruqaa", display: "swap" });
const tajawal = Tajawal({ weight: ["300", "400", "500", "700", "800"], subsets: ["arabic"], variable: "--font-tajawal", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://celinabites.com"),
  title: "Celina Pastry | سيلينا باستري — مناقيش، كرواسون، بيتزا، معجنات",
  description:
    "Celina Pastry — مناقيش، كرواسون، بيتزا، معجنات وكعك لبناني طازج كل يوم. Fresh manakish, croissants, pizza, pastries and kaak — order on WhatsApp.",
  keywords: ["Celina Pastry", "سيلينا باستري", "Celina Bites", "مناقيش", "كرواسون", "بيتزا", "معجنات", "كعك", "manakish", "Lebanon"],
  robots: site.preview ? { index: false, follow: false } : undefined,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Celina Pastry | سيلينا باستري",
    description: "مناقيش · كرواسون · بيتزا · معجنات — كل لقمة بطعم البيت",
    type: "website",
    url: "https://celinabites.com/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Celina Pastry" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#120D0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${serif.variable} ${script.variable} ${sans.variable} ${kufi.variable} ${ruqaa.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before paint so intro elements can start hidden without a flash,
            and applies the saved language before React hydrates (no Arabic→English flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(localStorage.getItem('celinabites.lang')==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr'}}catch(e){}",
          }}
        />
      </head>
      <body className="bg-ink font-sans text-dough antialiased">
        <LangProvider>
          <CartProvider>{children}</CartProvider>
        </LangProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
