"use client";
//import RequireAuth from "../components/RequireAuth";
import { setSelectedProduct } from "../lib/features/editProducts/editProductSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from '../components/Card'
import { useEffect, useState } from "react";

const Catalogs = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalogs`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setCatalogs(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching catalogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  const editCatalogHandler = (catalog) => {
    router.push(`catalogs/${catalog.id}`);
    dispatch(setSelectedProduct(catalog));
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  return (
      <div className="flex min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Catalogs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {catalogs.map((catalog, index) => (
              <Card cardClickHandler={editCatalogHandler} product={catalog} key={catalog.id} />
            ))}
          </div>
        </div >
      </div>
  );
};

export default Catalogs;
