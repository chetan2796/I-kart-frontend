'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploadedUrl(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" className="w-40 mt-2 rounded" />}
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload to ImageKit
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="mb-2">Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" className="w-40 rounded" />
        </div>
      )}
    </div>
  );
}
