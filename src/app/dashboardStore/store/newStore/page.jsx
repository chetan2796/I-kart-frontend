'use client';

import { useState } from 'react';
import Sidebar from "../../../components/Sidebar";
import RequireAuth from '../../../components/RequireAuth';


export default function AddStoreForm() {
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    banner: null,
    slug: `store-${crypto.randomUUID()}`
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    if (formData.logo) data.append('logo', formData.logo);
    if (formData.banner) data.append('banner', formData.banner);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/stores', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Store created successfully:', result);
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
              Add New Store
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" required onChange={handleChange} placeholder="Enter your store name"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
                <input type="file" name="logo" accept="image/*" onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Banner</label>
                <input type="file" name="banner" accept="image/*" onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => window.history.back()}
                  className="px-5 py-2 text-sm font-semibold border border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
