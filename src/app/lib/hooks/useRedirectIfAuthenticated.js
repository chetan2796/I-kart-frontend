import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useRedirectIfAuthenticated = (redirectTo = '/seller/dashboard') => {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace(redirectTo);
    } else {
      setChecking(false);
    }
  }, []);

  return checking;
};
