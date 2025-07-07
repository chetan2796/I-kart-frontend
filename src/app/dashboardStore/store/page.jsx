'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../components/Card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button asChild>
          <Link href="/dashboardStore/store/newStore">
            New Store
          </Link>
        </Button>
      </div>

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
    </div>
  );
}
