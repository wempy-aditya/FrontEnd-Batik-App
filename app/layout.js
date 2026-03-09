import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConditionalLayout from "../components/ConditionalLayout";
import { AuthProvider } from "../components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Batik Generative AI - UMM",
  description:
    "Platform riset dan produk batik berbasis AI dari Universitas Muhammadiyah Malang. Eksplorasi generasi batik, klasifikasi, retrieval, dan dataset batik.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
