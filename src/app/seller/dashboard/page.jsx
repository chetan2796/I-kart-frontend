"use client";
import FabricCanvas from "../../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Card from "../../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProduct } from "../../lib/features/editProducts/editProductSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DashboardSeller = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const authenticateAndFetch = async () => {
      try {
        const authCheckResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!authCheckResponse.ok) {
          throw new Error('Authentication check failed');
        }

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData = await userResponse.json();

        if (userData.roleId !== 2) {
          router.push('/unauthorized');
          return;
        }

        setUser(userData);

        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch products. Status: ${productResponse.status}`);
        }

        const productsData = await productResponse.json();
        setProducts(productsData);

      } catch (err) {
        console.error(err);
        router.push('/user/login');
      }
    };

    authenticateAndFetch();
  }, []);

  const cardClickHandler = (product) => {
    router.push(`products/${product.id}`);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/add" className="btn btn-primary">
          Add Product
        </Link>
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
