'use client';

import { useEffect, useState } from 'react';
//import RequireAuth from '../../components/RequireAuth';
//import Sidebar from '../../components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import Card from '../../components/Card';
import { useRouter } from 'next/navigation';

export default function StorePage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleCardClick = (store) => {
    router.push(`/dashboardStore/store/${store.id}`);
  };

  return (
      <div className="flex min-h-screen">
        <main className="flex-1 bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">My Store</h1>
          <Link href="/dashboardStore/store/newStore">
            <button className="bg-gray-200 text-black px-4 py-2 rounded mb-6 hover:bg-gray-300 transition cursor-pointer">
              New Store
            </button>
          </Link>


          {loading ? (
            <p className="text-center text-gray-600">Loading stores...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  product={store}
                  cardClickHandler={(selectedStore) => {
                    router.push(`/dashboardStore/store/${selectedStore.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
  );
}