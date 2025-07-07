'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useRedirectIfAuthenticated } from '../../lib/hooks/useRedirectIfAuthenticated';
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const checking = useRedirectIfAuthenticated();
  if (checking) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/generate`, {
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
            <Label htmlFor="email">Email address</Label>

            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({email: e.target.value})}
            />

            <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer" disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : null}
              Sign In
            </Button>
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
