'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useRedirectIfAuthenticated } from '../../lib/hooks/useRedirectIfAuthenticated';
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function User() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", phone: "", username: "" });
  const [loading, setLoading] = useState(false);

  const checking = useRedirectIfAuthenticated();
  if (checking) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();

    if (!form.email) {
      toast.error('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Enter a valid email address');
      return;
    }

    if (!form.username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (!/^[a-zA-Z0-9_. ]{3,10}$/.test(form.username)) {
      toast.error(
        'Username must be 3–10 characters (letters, numbers, dot, underscore, space)'
      );
      return;
    }

    if (!form.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Enter a valid  phone number');
      return;
    }

  setLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        phone: form.phone,
        username: form.username,
        roleName: 'seller',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('SignUp successful!');
      router.push("/user/login");
    } else {
      toast.error(data.message || "Signup failed. Try again.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800">Sign Up</h1>

          <form id= "signupForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
              <input type="text"  value={form.phone} onChange={(e) => { const onlyNums = e.target.value.replace(/[^0-9]/g, ''); setForm({ ...form, phone: onlyNums }); }} placeholder="Enter your phone number" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={10} pattern="[0-9]*"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <input type="text"  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter your username" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer" disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : null}
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/user/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0">
          <Image src="/images/login-bg-image.png" alt="Login Background" layout="fill" objectFit="cover" quality={100}/>
        </div>
      </div>
    </div>
  );
}
