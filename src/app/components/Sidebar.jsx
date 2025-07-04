'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { handleSignout } from '../lib/signout';
import clsx from 'clsx';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/seller/dashboard' },
    { label: 'Catalogs', href: '/catalogs' },
    { label: 'Stores', href: '/dashboardStore/store' },
  ];

  return (
    <div className="w-64 min-h-screen p-6 bg-gray-100 flex flex-col justify-between ">
      <div>
        <h2 className="text-2xl font-bold mb-6">I-Kart</h2>
        <ul className="space-y-4">
          {sidebarItems.map(({ label, href }) => (
            <Link
              href={href}
              className={clsx(
                'block p-2 rounded cursor-pointer hover:bg-gray-200',
                pathname === href && 'bg-gray-200 font-semibold'
              )}
              key={href}
              
            >
              <li>
                  {label}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={() => handleSignout(router, setSigningOut)}
          className={clsx('w-full text-left p-2 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50', signingOut && 'bg-gray-300 font-semibold')}
          disabled={signingOut}
        >
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
