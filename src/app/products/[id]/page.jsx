'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar";
import RequireAuth from "../../components/RequireAuth";


export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  if (!product) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex items-center justify-center flex-1 bg-gray-50 p-6">
          <div className="max-w-sm w-full border border-gray-200 bg-white rounded-lg shadow overflow-hidden">
            <div className="h-72 w-full overflow-hidden">
              <img
                src={product.productImages?.[0]?.url}
                alt={product.productImages?.[0]?.altText || product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="mb-4">
                {product.productVariants?.map((variant) => (
                  <div key={variant.optionName} className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">{variant.optionName}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.optionValues.map((val) => (
                        <span key={val} className="px-3 py-1 border rounded bg-gray-100 text-gray-700 text-sm">{val}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-2xl font-bold text-green-600 mb-4">${product.priceCents / 100}</div>
              <button className="w-full bg-gray-900 py-2 text-white rounded hover:bg-gray-700">Add to store</button>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
