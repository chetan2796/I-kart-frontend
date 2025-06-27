import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useRedirectIfAuthenticated = (redirectTo = '/dashboardSeller') => {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace(redirectTo);
    } else {
      router.replace('/user/login');
      setChecking(false);
    }
  }, []);

  return checking;
};
