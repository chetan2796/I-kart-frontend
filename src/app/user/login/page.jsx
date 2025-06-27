'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useRedirectIfAuthenticated } from '../../lib/hooks/useRedirectIfAuthenticated';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "" });

  const checking = useRedirectIfAuthenticated();
  if (checking) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email) {
      toast.error('Email is required');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Otp sent successfully!");
        localStorage.setItem("email", form.email);
        localStorage.setItem("isLoggedIn", "true");

      if (data.previewUrl) {
        window.open(data.previewUrl, "_blank");
      }
        router.push("/user/verifyOtp");
      } else {
        toast.error(data.message || "error occured. Try again.");
      }
    } catch (error) {
      console.error("login error:", error);
      toast.error("Something went wrong. Please try again.");
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
                E-mail address
              </label>
              <div className="relative">
                <input type="email" name="email" placeholder="example@email.com" value={form.email} onChange={(e) => setForm({ email: e.target.value })
                } className="w-full px-4 py-2 pr-10 border border-blue-400 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-blue-500" />
              </div>
            </div>

            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign in
            </button>
          </form>

          <p className="text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link href="/user/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative h-screen">
        <Image src="/images/login-bg-image.png" alt="Login Background" fill className="object-cover" />
      </div>
    </div>
  );
}
