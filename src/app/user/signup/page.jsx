'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", passwordConfirmation: ""});

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const isUserExists = existingUsers.some(user => user.email === form.email);
    if (isUserExists) {
      alert("User already exists with this email.");
      return;
    }
    const updatedUsers = [...existingUsers, form];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Signup successful!");
    router.push("/user/login");
  };


  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password Confirmation</label>
              <input type="password" required value={form.passwordConfirmation} onChange={(e) => setForm({ ...form, passwordConfirmation: e.target.value })} placeholder="Confirm Your Password" className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign Up
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
