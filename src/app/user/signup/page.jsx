'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", phnNumber: "", username: ""});

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        phone: form.phnNumber,
        username: form.username,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful!");
      router.push("/user/login");
    } else {
      alert(data.message || "Signup failed. Try again.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
              <input type="text" required value={form.phnNumber} onChange={(e) => { const onlyNums = e.target.value.replace(/[^0-9]/g, ''); setForm({ ...form, phnNumber: onlyNums }); }} placeholder="Enter your phone number" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={10} pattern="[0-9]*"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter your username" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign Up
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <hr className="w-20" /> or <hr className="w-20" />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Sign up as seller
            </button>
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
