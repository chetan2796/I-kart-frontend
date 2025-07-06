"use client";
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
//import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
//import RequireAuth from "../components/RequireAuth";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DashboardSeller = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const authToken = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
  };

  useEffect(() => {
    getData();
  }, []);

  const cardClickHandler = (product) => {
    router.push(`products/${product.id}`);
    dispatch(setSelectedProduct(product));
  };

  return (
      <div className="flex min-h-screen">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1 px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

          <Link href="/catalogs">
            <button className="bg-gray-200 text-black px-4 py-2 rounded mb-6 hover:bg-gray-300 transition cursor-pointer">
              New Product
            </button>
          </Link>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <Card
                cardClickHandler={cardClickHandler}
                product={product}
                key={product.id}
              />
            ))}
          </div>
        </div>
      </div>
  );
};

export default DashboardSeller;
