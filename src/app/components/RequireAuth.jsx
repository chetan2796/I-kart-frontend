'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RequireAuth({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
        router.push('/user/login');
        } else {
        setLoading(false);
        }
    }, []);

    if (loading) return <p className="p-4">Checking authentication...</p>;

    return children;
}