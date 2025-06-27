'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import Image from 'next/image';

export default function StoreShowPage() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
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

    if (id) fetchStore();
  }, [id]);

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
      const res = await fetch(`http://localhost:3000/stores/${id}/add-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: selectedProductIds }),
      });

      if (!res.ok) throw new Error('Failed to add products');

      alert('Products added successfully!');
      setShowModal(false);
      setSelectedProductIds([]);
    } catch (error) {
      console.error('Error adding products:', error);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!store) return <p className="p-8">Store not found</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <button
            onClick={handleAddProductClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Product
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

        <p className="text-xl text-gray-700">Price: ₹ {store.price}</p>

        {/* Modal */}
        {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Select Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-80 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative cursor-pointer ${
                    selectedProductIds.includes(product.id) ? 'ring-2 ring-blue-500' : ''
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
