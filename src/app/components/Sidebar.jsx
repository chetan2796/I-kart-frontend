'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">I-Kart</h2>
      <ul className="space-y-4">
        <li><Link href="/dashboardSeller">Dashboard</Link></li>
        <li><Link href="/newProducts">Products</Link></li>
        <li><Link href="/dashboardStore">Stores</Link></li>
        <li><Link href="/dashboardStore/store">My Stores</Link></li>
      </ul>
    </div>
  );
}
