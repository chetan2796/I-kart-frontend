'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import LoadingButton from "../../components/LoadingButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = form.email || localStorage.getItem("email");
  
    if (!form.code || !email) {
      toast.error("OTP and email are required.");
      return;
    }
  
    setLoading(true);
    try {
      // 1. Verify OTP
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/verify`, {
        method: "POST",
        credentials: "include", 
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          code: form.code, 
          email 
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "OTP verification failed");
      }
  
      // 2. Check authentication status
      const authCheckResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      if (!authCheckResponse.ok) {
        throw new Error("Authentication check failed");
      }
  
      toast.success("Login successful!");
      router.push("/seller/dashboard");
  
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
        <div className="max-w-md w-full">
          <h1 className="text-xl font-bold mb-1 text-gray-700">Start your journey</h1>
          <h1 className="text-4xl font-bold mb-6 text-gray-700">Sign In to i-kart</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="relative">
                <input type="text" name="code" placeholder="Enter OTP" value={form.code} onChange={(e) => setForm({ code: e.target.value })
                } className="w-full px-4 py-2 pr-10 border border-blue-400 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-blue-500" />
              </div>
            </div>

            <LoadingButton loading={loading} type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer">
              Verify OTP
            </LoadingButton>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative h-screen">
        <Image src="/images/login-bg-image.png" alt="Login Background" fill className="object-cover" />
      </div>
    </div>
  );
}
