'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      router.push('/user/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="p-4">Checking authentication...</p>;

  return children;
}
