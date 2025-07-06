'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from './lib/store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isTokenExpired } from "./lib/auth";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const storeRef = useRef(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const pathname = usePathname();
  const [hideSidebar, setHideSidebar] = useState(false); 

  const publicRoutes = [
    '/user/login',
    '/user/signup',
    '/user/verifyOtp',
    '/',
  ];

  const numericPathRegex = /^\/[0-9]+(\/.*)?$/;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublic = publicRoutes.includes(pathname) || numericPathRegex.test(pathname);
    

    if ((!token || isTokenExpired(token)) && !isPublic) {
      localStorage.clear();
      window.location.href = '/user/login'; 
      return;
    }

    setHideSidebar(isPublic);
  }, [pathname]);


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={storeRef.current}>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {!hideSidebar && <Sidebar />}
            <main style={{ flexGrow: 1, width: '100%' }}>{children}</main>
          </div>
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