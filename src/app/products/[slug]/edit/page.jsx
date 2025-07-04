'use client';

import React, { useState, useEffect, useRef } from 'react';
//import Sidebar from "../../../components/Sidebar";
//import RequireAuth from "../../../components/RequireAuth";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductEditPage({ params }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    priceCents: 0,
    productVariants: [],
    productImages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${slug}`, {
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
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'priceCents' ? Math.round(parseFloat(value) * 100) : value
    }));
  };

  const handleVariantChange = (variantIndex, optionIndex, value) => {
    setProduct(prev => {
      const updatedVariants = [...prev.productVariants];
      updatedVariants[variantIndex].optionValues[optionIndex] = value;
      return { ...prev, productVariants: updatedVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const productPayload = {
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      priceCurrency: product.priceCurrency,
      slug: product.slug,
      categoryId: product.categoryId,
      productVariants: product.productVariants,
      productImages: product.productImages.map(image => ({
        url: image.url,
        altText: image.altText
      }))
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${slug}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });
      if (!res.ok) throw new Error('Failed to update product');
      router.push(`/products/${slug}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <Link
              href={`/products/${slug}`}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none"
                rows="4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="priceCents"
                value={(product.priceCents / 100).toFixed(2)}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded shadow appearance-none"
                required
              />
            </div>

            {product.productVariants?.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-4 border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">{variant.optionName}</h3>
                <div className="space-y-2">
                  {variant.optionValues.map((value, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleVariantChange(variantIndex, optionIndex, e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow appearance-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
