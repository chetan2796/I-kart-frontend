"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AddStoreForm() {
  const slug = useMemo(() => `store-${crypto.randomUUID()}`, []);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    banner: null,
    slug,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const logoBase64 = formData.logo
        ? await toBase64(formData.logo)
        : undefined;
      const bannerBase64 = formData.banner
        ? await toBase64(formData.banner)
        : undefined;

      const payload = {
        name: formData.name,
        slug: formData.slug,
        logo: logoBase64,
        banner: bannerBase64,
      };

      const response = await fetch("http://localhost:3000/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      router.push("/dashboardStore/store");
      const result = await response.json();
      console.log("Store created successfully:", result);
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Add New Store
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter store name"
                onChange={handleChange}
                required
              />

              <Label htmlFor="logo">Logo</Label>
              <Input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
                required
              />

              <Label htmlFor="banner">Banner</Label>
              <Input
                type="file"
                name="banner"
                accept="image/*"
                onChange={handleChange}
                required
              />

            <div className="flex justify-start space-x-4">
              <Button>
                Create Store
              </Button>
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => window.history.back()}
                >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
