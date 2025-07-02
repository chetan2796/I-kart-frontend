'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from './lib/store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isTokenExpired } from "./lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/user/login', '/user/signup', '/user/verifyOtp'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublic = publicRoutes.includes(pathname);

    if ((!token || isTokenExpired(token)) && !isPublic) {
      localStorage.clear();
      router.push('/user/login');
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={storeRef.current}>{children}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Provider>
      </body>
    </html>
  );
}
