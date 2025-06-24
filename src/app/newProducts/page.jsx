"use client";
import Sidebar from "../components/Sidebar";
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const newProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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
      description: "this is new descriptions",
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

  const editProductHandler = (product) => {
    router.push(`posts/${product.id}`);
    dispatch(setSelectedProduct(product));
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div onClick={() => editProductHandler(product)} href={`posts/${product.id}`} className="block w-full h-full">
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
                      <span className="font-semibold text-black">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-black">
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
                  <p className="text-sm mt-1 line-clamp-2 text-black">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div >
    </div >
  );
};

export default newProducts;
