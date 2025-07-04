'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
//import Sidebar from '../../../components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';

export default function StoreShowPage() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/stores/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch store');
        const data = await res.json();
        setStore(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!id) return;
    setLoading(true);
    Promise.all([fetchStore(), fetchStoreProducts()]).finally(() => setLoading(false));
  }, [id]);


  const fetchStoreProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/store-products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 404) {
        setStoreProducts([]);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch store products');
      const data = await res.json();
      setStoreProducts(data);
    } catch (error) {
      console.error('Error fetching store products:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProductClick = () => {
    fetchProducts();
    setShowModal(true);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/store-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProductIds,
          storeId: Number(id)
        }),
      });

      if (!res.ok) throw new Error('Failed to add products');

      setShowModal(false);
      setSelectedProductIds([]);
      await fetchStoreProducts();
    } catch (error) {
      console.error('Error adding products:', error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/store-products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to delete product from store');

      await fetchStoreProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!store) return <p className="p-8">Store not found</p>;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <button
            onClick={handleAddProductClick}
            className="bg-gray-200 text-black px-4 py-2 rounded mb-6 hover:bg-gray-300 transition cursor-pointer"
          >
            Add Product
          </button>
        </div>

        <div className="relative h-64 w-full mb-6">
          <Image
            src={store.image || '/images/login-bg-image.png'}
            alt={store.name}
            fill
            className="object-cover rounded"
            priority
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
                title="Remove product"
              >
                ❌
              </button>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <p className="text-blue-600 font-bold text-md mt-2">
                  ₹ {(product.priceCents / 100).toFixed(2)}
                </p>
                <Link href={`/products/${product.id}`}>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Select Products</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-80 overflow-y-auto">
                {products
                  .filter((product) => !storeProducts.some((storeProduct) => storeProduct.id === product.id))
                  .map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative cursor-pointer ${selectedProductIds.includes(product.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                      onClick={() => handleCheckboxChange(product.id)}
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={product.image || '/images/login-bg-image.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">₹ {product.price}</p>
                      </div>
                      {selectedProductIds.includes(product.id) && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Selected
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
