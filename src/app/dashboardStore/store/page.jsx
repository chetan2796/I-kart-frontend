'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '../../components/RequireAuth';
import Sidebar from '../../components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';

export default function StorePage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/stores', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!res.ok) {
          throw new Error(`Error fetching stores: ${res.status}`);
        }

        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-8">
          <Link href="/dashboardStore/store/newStore">
            <button className="mt-4 bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition">
              Add New Store
            </button>
          </Link>

          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            My Store
          </h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading stores...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={store.image || '/images/login-bg-image.png'}
                      alt={store.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {store.name}
                    </h2>
                    <p className="text-blue-600 font-bold text-md mt-2">
                      ₹ {store.price}
                    </p>
                    <Link href={`/dashboardStore/store/${store.id}`}>
                      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        View Store
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
