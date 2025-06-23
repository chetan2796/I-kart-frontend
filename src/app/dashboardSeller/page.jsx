'use client'
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

const DashboardSeller = () => {
  const products = [
    { name: "Hwll", price: 12.0, image: "/images/login-bg-image.png" },
    { name: "Dfd", price: 12121.0, image: "/images/login-bg-image.png" },
    { name: "Fed", price: 12.0, image: "/images/login-bg-image.png" },
    { name: "Products", price: 1222.0, image: "/images/login-bg-image.png" },
    {
      name: "Product",
      price: 2000.0,
      salePrice: 1220.0,
      image: "/images/login-bg-image.png",
    },
    {
      name: "T Shirt9",
      description: "this is new descriptions",
      image: "/images/login-bg-image.png",
    },
    {
      name: "T Shirt",
      description: "this is new t-shirt",
      image: "/images/login-bg-image.png",
    },
    {
      name: "Botal Nice",
      description: "botal_nice",
      image: "/images/login-bg-image.png",
    },
    {
      name: "Botal",
      description: "botal",
      image: "/images/login-bg-image.png",
    },
  ];

  const getData = async () => {
    const response = await fetch('http://localhost:3000/')
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <button className="bg-amber-400 text-black">
        <Link href="/newProducts">New Product</Link>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            {/* Image container with fixed aspect ratio */}
            <div className="relative h-40 mb-3 rounded-md overflow-hidden bg-gray-100">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  priority={index < 3} // Only prioritize first few images
                />
              )}
            </div>

            {/* Product info */}
            <h2 className="text-lg font-medium line-clamp-1 text-black">{product.name}</h2>

            {/* Pricing */}
            <div className="mt-1">
              {product.salePrice ? (
                <div className="flex gap-2 items-center">
                  <span className="text-red-500 font-semibold text-black">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-sm line-through text-black">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                product.price && (
                  <span className="font-medium text-black">
                    ${product.price.toFixed(2)}
                  </span>
                )
              )}
            </div>

            {/* Description (only shown if exists) */}
            {product.description && (
              <p className="text-gray-500 text-sm mt-1 line-clamp-2 text-black">
                {product.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSeller;
