import Sidebar from "../../../components/Sidebar";

function EditProductPage({ params }) {
  const { id } = params;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product ({id})</h1>
      </div>
    </div>
  );
}

export default EditProductPage;
