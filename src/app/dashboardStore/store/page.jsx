'use client';

import Sidebar from "../../components/Sidebar"; 
import Image from 'next/image';
import Link from 'next/link';

export default function StorePage() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1499,
      image: "/images/login-bg-image.png",
    },
    {
      id: 2,
      name: "Smartwatch",
      price: 2299,
      image: "/images/login-bg-image.png",
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 999,
      image: "/images/login-bg-image.png",
    },
    {
      id: 4,
      name: "Gaming Mouse",
      price: 799,
      image: "/images/login-bg-image.png",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar /> 
      <main className="flex-1 bg-gray-100 p-8">
        <Link href="/dashboardStore/store/newStore">
          <button className="mt-4 bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition">
            Add New Store
          </button>
        </Link>
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Store</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-blue-600 font-bold text-md mt-2">
                  ₹ {product.price}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
