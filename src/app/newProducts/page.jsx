"use client";
import Sidebar from "../components/Sidebar";
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from '../components/Card'

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <Card cardClickHandler={editProductHandler} product={product} key={product.id} />
          ))}
        </div>
      </div >
    </div >
  );
};

export default newProducts;
