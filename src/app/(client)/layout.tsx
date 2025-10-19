import type { Metadata } from "next";

import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



export const metadata: Metadata = {
  title: {
    template: "%s - Shopy online store",
    default: 'Shopy online store'

  },
  description: 'Shopy online store, Your one stop for all your needs'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1"> {children}</main>
      <Footer />
    </div>

  );
}
