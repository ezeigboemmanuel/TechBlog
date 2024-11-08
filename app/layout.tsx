import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopBtn from "@/components/BackToTopBtn";
import ConvexClientProvider from "@/providers/ConvexClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TechBlog",
  description:
    "TechBlog is a multi-user blog where different users can write and publish their blogs.",
  openGraph: {
    title: "TechBlog",
    description:
      "TechBlog is a multi-user blog where different users can write and publish their blogs.",
    siteName: "TechBlog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F3F3F5]`}
      >
        <ConvexClientProvider>
          <Navbar />
          <div className="px-3 md:px-6 max-w-[1400px] mx-auto">{children}</div>
          <Footer />
          <BackToTopBtn />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
