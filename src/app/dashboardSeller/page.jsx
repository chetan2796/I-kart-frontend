'use client';
import FabricCanvas from "../components/FabricCanvas";
import RequireAuth from '../components/RequireAuth';
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

const DashboardSeller = () => {
  const getData = async () => {
    const response = await fetch('http://localhost:3000/')
  }

  useEffect(() => {
    getData()
  }, [])

  const cardClickHandler = () => {

  }

  return (
    <RequireAuth>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <Card cardClickHandler={cardClickHandler} product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default DashboardSeller;
