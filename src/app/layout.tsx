import ReactQueryProvider from "@/lib/react-query-provider";
import UserCheck from "@/lib/user";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Construction Progress Tracker",
  description: "",
};

export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* {process.env.NEXT_PUBLIC_ENV === "production" && <GoogleTagManager gtmId="GTM-WP4DVZ5D" />} */}
      <body className={`${lato.variable} antialiased`}>
        <ReactQueryProvider>
          <UserCheck>{children}</UserCheck>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
