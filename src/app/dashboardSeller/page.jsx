'use client';
import FabricCanvas from "../components/FabricCanvas";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import RequireAuth from "../components/RequireAuth";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useRouter } from "next/navigation";

const DashboardSeller = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const product1 = useSelector((state) => state.productList.selectedProductList)
  console.log("product1==>>", product1)
  const products = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 499.0,
      image: "https://picsum.photos/seed/tshirt1/400/400",
    },
    {
      id: 2,
      name: "Blue Denim Jeans",
      price: 1599.0,
      image: "https://picsum.photos/seed/jeans2/400/400",
    },
    {
      id: 3,
      name: "Black Hoodie",
      price: 1299.0,
      image: "https://picsum.photos/seed/hoodie3/400/400",
    },
    {
      id: 4,
      name: "Cotton Kurta",
      price: 899.0,
      image: "https://picsum.photos/seed/kurta4/400/400",
    },
    {
      id: 5,
      name: "Formal Blazer",
      price: 2999.0,
      salePrice: 2499.0,
      image: "https://picsum.photos/seed/blazer5/400/400",
    },
    {
      id: 6,
      name: "Printed Summer Dress",
      description: "Lightweight floral dress perfect for summer outings.",
      price: 1199.0,
      image: "https://picsum.photos/seed/dress6/400/400",
    },
    {
      id: 7,
      name: "Graphic T-Shirt",
      description: "Trendy graphic print for casual wear.",
      price: 599.0,
      image: "https://picsum.photos/seed/graphic7/400/400",
    },
    {
      id: 8,
      name: "Slim Fit Chinos",
      description: "Comfortable cotton chinos in olive green.",
      price: 1399.0,
      image: "https://picsum.photos/seed/chinos8/400/400",
    },
    {
      id: 9,
      name: "Leather Jacket",
      description: "Premium quality faux leather biker jacket.",
      price: 3499.0,
      image: "https://picsum.photos/seed/jacket9/400/400",
    },
  ];



  const getData = async () => {
    const response = await fetch('http://localhost:3000/')
  }

  useEffect(() => {
    getData()
  }, [])

  const cardClickHandler = (product) => {
    router.push(`posts/${product.id}`);
    dispatch(setSelectedProduct(product));
  }

  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

          <Link href="/newProducts">
            <button className="bg-gray-200 text-black px-4 py-2 rounded mb-6 hover:bg-gray-300 transition cursor-pointer">
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
