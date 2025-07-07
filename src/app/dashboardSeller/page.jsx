"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";

const DashboardSeller = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);

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
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const cardClickHandler = (product) => {
    router.push(`products/${product.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/catalogs">
            New Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <Card
            cardClickHandler={cardClickHandler}
            product={product}
            key={product.id}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardSeller;
