'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ProductEditPage({ params }) {
  const { id } = React.use(params);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
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

    if (id) fetchProduct();
  }, [id]);

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
      productVariants: product.productVariants.map(option => ({
        optionName: option.optionName,
        optionValues: option.optionValues
      })),
      productImages: product.productImages.map(image => ({
        url: image.url,
        altText: image.altText
      }))
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });
      if (!res.ok) throw new Error('Failed to update product');
      router.push(`/products/${id}`);
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
            <h1 className="text-2xl font-bold">Edit Product</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="mb-4"
              required
            />

            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="mb-4"
              required
            />

            <Label htmlFor="price">Price ($)</Label>
            <Input
              type="number"
              name="priceCents"
              value={(product.priceCents / 100)}
              onChange={handleChange}
              className="mb-4"
              min="0"
              required
            />

            {product.productVariants?.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-4">
                <Label htmlFor={variant.optionName}>{variant.optionName}</Label>
                <div className="space-y-2">
                  {variant.optionValues.map((value, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <Input
                        type="text"
                        value={value}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
 
            <div className="flex justify-start space-x-4 pt-4">
              <Button disabled={isSubmitting} className="cursor-pointer">
                Update Product
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/products/${id}`}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
