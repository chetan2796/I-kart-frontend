'use client';
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";

const DashboardSeller = () => {
  const products = [
    { id: 1, name: "Hwll", price: 12.0, image: "/images/login-bg-image.png" },
    { id: 2, name: "Dfd", price: 12121.0, image: "/images/login-bg-image.png" },
    { id: 3, name: "Fed", price: 12.0, image: "/images/login-bg-image.png" },
    { id: 4, name: "Products", price: 1222.0, image: "/images/login-bg-image.png" },
    {
      id: 5,
      name: "Product",
      price: 2000.0,
      salePrice: 1220.0,
      image: "/images/login-bg-image.png",
    },
    {
      id: 6,
      name: "T Shirt9",
      description: "this is new description",
      image: "/images/login-bg-image.png",
    },
    {
      id: 7,
      name: "T Shirt",
      description: "this is new t-shirt",
      image: "/images/login-bg-image.png",
    },
    {
      id: 8,
      name: "Botal Nice",
      description: "botal_nice",
      image: "/images/login-bg-image.png",
    },
    {
      id: 9,
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

        <Link href="/newProducts">
          <button className="bg-amber-400 text-black px-4 py-2 rounded mb-6 hover:bg-amber-500 transition">
            New Product
          </button>
        </Link>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-40 mb-3 rounded-md overflow-hidden bg-gray-100">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />
                )}
              </div>

              {/* Product Name */}
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product.name}
              </h2>

              {/* Price Section */}
              <div className="mt-2">
                {product.salePrice ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-red-600 font-semibold">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  product.price && (
                    <span className="text-gray-800 font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                  )
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
