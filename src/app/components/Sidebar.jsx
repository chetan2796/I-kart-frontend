'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleSignout } from '../lib/signout';

export default function Sidebar() {
  const router = useRouter();
  return (
    <div className="w-64 min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">I-Kart</h2>
      <ul className="space-y-4">
        <Link href="/dashboardSeller"><li className='hover:bg-gray-200 p-2 cursor-pointer'>Dashboard</li></Link>
        <Link href="/catalogs"><li className='hover:bg-gray-200 p-2 cursor-pointer'>Catalogs</li></Link>
        <Link href="/dashboardStore/store"><li className='hover:bg-gray-200 p-2 cursor-pointer'>My Stores</li></Link>
        <li
          className='hover:bg-gray-200 p-2 cursor-pointer'
          onClick={()=>handleSignout(router)}
        >
          Signout
        </li>
      </ul>
    </div>
  );
}
