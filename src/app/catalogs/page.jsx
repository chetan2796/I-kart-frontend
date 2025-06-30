"use client";
import Sidebar from "../components/Sidebar";
import FabricCanvas from "../components/FabricCanvas";
import RequireAuth from "../components/RequireAuth";
import Link from "next/link";
import Image from "next/image";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from '../components/Card'
import { useEffect, useState } from "react";

const NewProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/catalogs");
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

  const editProductHandler = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    router.push(`catalog/${product.id}`);
    dispatch(setSelectedProduct(product));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Products</h1>
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Products</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading products: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Catalogs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {products.map((product, index) => (
              <Card cardClickHandler={editProductHandler} product={product} key={product.id} />
            ))}
          </div>
        </div >
      </div>
    </RequireAuth>
  );
};

export default NewProducts;
