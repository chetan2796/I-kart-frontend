'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (user) => user.email === form.email
    );

    if (matchedUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      alert("Login successful!");
      router.push("/dashboardSeller");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-black">Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                E-mail address
              </label>
              <div className="relative">
                <input type="email"  name="email" placeholder="example@email.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })
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
