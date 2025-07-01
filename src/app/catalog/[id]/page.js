'use client';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function editProducts({ params }) {
  const { id } = React.use(params);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [color, setColor] = useState('#000000');
  const [recentImages, setRecentImages] = useState([]);
  const [productType, setProductType] = useState('tshirt');
  const formRef = useRef(null);
  const [savedImage, setSavedImage] = useState(null);
  const [imageKitUrl, setImageKitUrl] = useState(null)
  const [catalog, setCatalog] = useState(null);
  const [catalogVariants, setCatalogVariants] = useState([]);
  const [authToken, setAuthToken] = useState(null)
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    variants: {},
    designData: "", // for hidden input, if you need to add data programmatically
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (type, value) => {
    setForm((prev) => {
    const existing = prev.variants[type] || [];
      const updated = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return {
        ...prev,
        variants: {
          ...prev.variants,
          [type]: updated,
        },
      };
    });
  };

  const fetchCatalog = async () => {
    try {
      const authToken = localStorage.getItem('token')
      setAuthToken(authToken)
      const res = await fetch(`http://localhost:3000/catalogs/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch catalog');
      const data = await res.json();
      setCatalog(data);
      setCatalogVariants(data.catalogVariants.reduce((acc, variant) => {
        return { ...acc, [variant.optionName]: variant.optionValues };
      }, {}));
    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    if (id) fetchCatalog();
  }, [id]);

  const printAreas = {
    tshirt: {
      width: 200,
      height: 200,
      left: 280,
      top: 150,
      fill: 'rgba(255,255,255,0)',
      stroke: 'red',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      hoverCursor: 'default',
      zIndex: 99,
    },
    mug: {
      width: 200,
      height: 120,
      left: 300,
      top: 240,
      fill: 'rgba(255,255,255,0)',
      stroke: 'blue',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      zIndex: 99,
    },
    bottle: {
      width: 150,
      height: 300,
      left: 325,
      top: 150,
      fill: 'rgba(255,255,255,0)',
      stroke: 'green',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      zIndex: 99,
    },
  };

  const compressBase64Image = (base64, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale the image if it's too wide
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress the image to JPEG with given quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality); // 0.0 (low) to 1.0 (high)
        resolve(compressedBase64);
      };

      img.onerror = (err) => {
        console.error("Image load error", err);
        resolve(base64); // fallback
      };
    });
  };

  // Load Fabric.js
  useEffect(() => {
    const loadFabric = async () => {
      if (!window.fabric) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      setFabric(window.fabric);
    };
    loadFabric();
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (catalog && fabric && canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });
      setCanvas(newCanvas);
      setupCanvas(newCanvas, productType);
      return () => {
        newCanvas.dispose();
      };
    }
  }, [catalog, fabric, productType]);

  // Load recent images
  useEffect(() => {
    const cached = localStorage.getItem('recentImages');
    if (cached) {
      setRecentImages(JSON.parse(cached));
    }
  }, []);

  const setupCanvas = (canvasInstance, type) => {
    loadBaseProductImage(canvasInstance);
    setupPrintArea(canvasInstance, type);
    setupObjectControls(canvasInstance);
  };

  const loadBaseProductImage = (canvasInstance) => {
    // Using a placeholder image; replace with your carousel logic if needed
    const imageSrc = catalog?.catalogImages?.[0]?.url; // Adjust path as needed
    fabric.Image.fromURL(imageSrc, (img) => {
      img.scaleToWidth(canvasInstance.width * 0.9);
      img.set({
        left: canvasInstance.width / 2,
        top: canvasInstance.height / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasControls: false,
        hasBorders: false,
        name: 'base-image',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
      });
      canvasInstance.add(img);
      canvasInstance.sendToBack(img);
    }, { crossOrigin: 'anonymous' });
  };

  const setupPrintArea = (canvasInstance, type, showBorder = true) => {
    const existingArea = canvasInstance.getObjects().find((obj) => obj.name === 'print-area');
    if (existingArea) {
      canvasInstance.remove(existingArea);
    }
    if (printAreas[type]) {
      const config = printAreas[type];
      const area = new fabric.Rect({
        name: 'print-area',
        ...config,
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        visible: showBorder,
      });
      canvasInstance.add(area);
      area.sendToBack();
      canvasInstance.renderAll();
    }
  };

  const setupObjectControls = (canvasInstance) => {
    canvasInstance.on('selection:created', () => addDeleteControl(canvasInstance));
    canvasInstance.on('selection:updated', () => addDeleteControl(canvasInstance));
    canvasInstance.on('selection:cleared', removeDeleteControl);
    canvasInstance.on('object:moving', () => {
      const warning = document.querySelector('.print-area-warning');
      if (!validateDesignPosition(canvasInstance)) {
        if (!warning) {
          const warnEl = document.createElement('div');
          warnEl.className = 'print-area-warning';
          warnEl.textContent = 'Design is outside printable area';
          canvasInstance.wrapperEl.appendChild(warnEl);
        }
      } else {
        if (warning) warning.remove();
      }
    });
    canvasInstance.on('object:modified', () => {
      const warning = document.querySelector('.print-area-warning');
      if (warning) warning.remove();
    });
  };

  const addDeleteControl = (canvasInstance) => {
    const activeObject = canvasInstance.getActiveObject();
    if (activeObject && !activeObject.name.includes('base')) {
      addDeleteButtonToObject(canvasInstance, activeObject);
    }
  };

  const removeDeleteControl = () => {
    const deleteBtn = document.querySelector('.canvas-delete-btn');
    if (deleteBtn) {
      deleteBtn.remove();
    }
  };

  const addDeleteButtonToObject = (canvasInstance, obj) => {
    removeDeleteControl();
    const objLeft = obj.left;
    const objTop = obj.top;
    const objWidth = obj.getScaledWidth();
    const objHeight = obj.getScaledHeight();
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'canvas-delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.left = `${objLeft + objWidth / 2 - 10}px`;
    deleteBtn.style.top = `${objTop - objHeight / 2 - 15}px`;
    deleteBtn.style.width = '20px';
    deleteBtn.style.height = '20px';
    deleteBtn.style.backgroundColor = 'white';
    deleteBtn.style.borderRadius = '50%';
    deleteBtn.style.display = 'flex';
    deleteBtn.style.alignItems = 'center';
    deleteBtn.style.justifyContent = 'center';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    deleteBtn.style.zIndex = '1000';
    deleteBtn.style.color = 'red';
    deleteBtn.style.fontWeight = 'bold';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      canvasInstance.remove(obj);
      canvasInstance.discardActiveObject();
      canvasInstance.renderAll();
      deleteBtn.remove();
    });
    canvasInstance.wrapperEl.appendChild(deleteBtn);
    obj.on('moving', () => {
      const newLeft = obj.left;
      const newTop = obj.top;
      deleteBtn.style.left = `${newLeft + objWidth / 2 - 10}px`;
      deleteBtn.style.top = `${newTop - objHeight / 2 - 15}px`;
    });
    obj.on('removed', () => {
      deleteBtn.remove();
    });
  };

  const addEmoji = (emoji) => {
    if (!canvas) return;
    const text = new fabric.Text(emoji, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: 40,
      fill: color,
      fontFamily: 'Arial, sans-serif',
      hasControls: true,
      originX: 'center',
      originY: 'center',
      name: 'emoji',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    // Close modal (assuming Bootstrap is handling it)
    const modal = window.bootstrap.Modal.getInstance(document.getElementById('emojiModal'));
    if (modal) modal.hide();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      cacheImage(file.name, file.type, file.size, f.target.result);
      fabric.Image.fromURL(f.target.result, (img) => {
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: 0.5,
          scaleY: 0.5,
          hasRotatingPoint: true,
          cornerSize: 12,
          transparentCorners: false,
          padding: 10,
          cornerColor: '#4a89dc',
          borderColor: '#4a89dc',
          name: 'custom-image',
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    };
    reader.readAsDataURL(file);
  };

  const cacheImage = (name, type, size, dataURL) => {
    const updatedImages = [...recentImages];
    const existingIndex = updatedImages.findIndex((img) => img.name === name);
    if (existingIndex >= 0) {
      updatedImages[existingIndex] = { name, type, size, data: dataURL, lastModified: Date.now() };
    } else {
      updatedImages.push({ name, type, size, data: dataURL, lastModified: Date.now() });
    }
    const sorted = updatedImages.sort((a, b) => b.lastModified - a.lastModified).slice(0, 5);
    setRecentImages(sorted);
    localStorage.setItem('recentImages', JSON.stringify(sorted));
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('Your Text Here', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      width: 150,
      fontSize: 20,
      fill: color,
      fontFamily: 'Arial',
      hasControls: true,
      padding: 5,
      backgroundColor: 'rgba(255,255,255,0.7)',
      originX: 'center',
      originY: 'center',
      name: 'custom-text',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const updateTextColor = (e) => {
    setColor(e.target.value);
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fill', e.target.value);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && !activeObject.name.includes('base')) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const validateDesignPosition = (canvasInstance) => {
    const printArea = canvasInstance.getObjects().find((obj) => obj.name === 'print-area');
    if (!printArea) return true;

    const areaBounds = printArea.getBoundingRect();
    const customObjects = canvasInstance.getObjects().filter(
      (obj) => obj.name && obj.name.includes('custom')
    );

    return customObjects.every((obj) => {
      const objBounds = obj.getBoundingRect();

      return (
        objBounds.left >= areaBounds.left &&
        objBounds.top >= areaBounds.top &&
        objBounds.left + objBounds.width <= areaBounds.left + areaBounds.width &&
        objBounds.top + objBounds.height <= areaBounds.top + areaBounds.height
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canvas) return;
    const customObjects = canvas.getObjects().filter((obj) =>
      obj.name && obj.name.includes('custom')
    );
    if (customObjects.length === 0) {
      alert('Please add at least one customization (text or image) before saving!');
      return;
    }
    if (!validateDesignPosition(canvas)) {
      alert('Some design elements are outside the printable area. Please adjust them before saving.');
      return;
    }
    const printArea = canvas.getObjects().find((obj) => obj.name === 'print-area');
    if (printArea) {
      printArea.set({ stroke: 'transparent', fill: 'transparent' });
      canvas.renderAll();
    }
    let dataURL;
    dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
    console.log('Design saved:', dataURL); // Replace with actual form submission
    alert('Design saved')
    setupPrintArea(canvas, productType);
    setSavedImage(dataURL)
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      variants: form.variants,
      designData: form.designData,
    };
    console.log("payload==>>", payload)
    console.log("dataURL==>>", dataURL)
    console.log("saved iamge==>>", savedImage)
    const compressedImage = await compressBase64Image(dataURL, 800, 0.6);
    console.log("CompressedImage image:", compressedImage);
    let modifiedProduct = {
      "name": catalog.name,
      "description": payload.description,
      "priceCents": payload.price || 100,
      "priceCurrency": "USD",
      "slug": generateRandomSlug(catalog.name),
      "catalogId": printArea.catalogId || 1,
      "productVariants": Object.entries(payload.variants).map(([optionName, optionValues]) => ({
        optionName,
        optionValues,
      })),
      "productImages": [
        {
          "url": compressedImage,
          "altText": 'image'
        }
      ]
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(
          modifiedProduct
        ),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("email", form.email);
        localStorage.setItem("isLoggedIn", "true");
        router.push('/dashboardSeller');
      } else {
        alert(data.message || "error occured. Try again.");
      }
    } catch (error) {
      console.error("login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const generateRandomSlug = () => {
    const randomString = Math.random().toString(36).substring(2, 8); // 6 random chars
    const randomNumber = Math.floor(Math.random() * 1000); // Random number (0-999)
    return `product-${randomString}-${randomNumber}`;
  };

  const deleteCachedImage = (fileName) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      const updatedImages = recentImages.filter((img) => img.name !== fileName);
      setRecentImages(updatedImages);
      localStorage.setItem('recentImages', JSON.stringify(updatedImages));
      canvas?.getObjects()
        .filter((obj) => obj.name === 'custom-image' && obj.src?.includes(fileName))
        .forEach((obj) => canvas.remove(obj));
      canvas?.renderAll();
    }
  };

  return (
    <>
      <Head>
        <title>Design Editor | Customize Your Product</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-4 py-6 flex-1">
          {/* Header */}
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">Design Your Product</h1>
            <p className="text-gray-600">Create a custom design for your {productType}</p>
          </header>

          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            {/* Canvas Area - Takes remaining space */}
            <div className="flex-1 mb-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-paint-brush text-indigo-500"></i>
                    Design Canvas
                  </h2>
                </div>
                <div className="p-4 h-[calc(100%-68px)] flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width="800"
                    height="600"
                    className="max-w-full max-h-full border border-gray-200"
                  ></canvas>
                </div>
              </div>
            </div>

            {/* Bottom Controls Panel */}
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-indigo-500"></i>
                  Design Tools
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {/* Recent Images - Moved above Upload button */}
                <div className="mt-2">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2 text-sm">
                    <i className="fas fa-history text-indigo-500"></i>
                    Recent Images
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {recentImages.map((file) => (
                      <div key={file.name} className="relative group flex-shrink-0">
                        <div className="w-16 h-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img
                            src={file.data}
                            alt={file.name}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              fabric.Image.fromURL(file.data, (img) => {
                                img.set({
                                  left: canvas?.width / 2,
                                  top: canvas?.height / 2,
                                  originX: 'center',
                                  originY: 'center',
                                  scaleX: 0.5,
                                  scaleY: 0.5,
                                  hasRotatingPoint: true,
                                  cornerSize: 12,
                                  transparentCorners: false,
                                  padding: 10,
                                  cornerColor: '#4a89dc',
                                  borderColor: '#4a89dc',
                                  name: 'custom-image',
                                  src: file.data,
                                });
                                canvas?.add(img);
                                canvas?.setActiveObject(img);
                                canvas?.renderAll();
                              }, { crossOrigin: 'anonymous' });
                            }}
                          />
                        </div>
                        <button
                          onClick={() => deleteCachedImage(file.name)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 text-xs"
                          title="Delete image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Image Button (only remaining action button) */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => document.getElementById('fileUpload').click()}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <i className="fas fa-image"></i>
                    Upload Image
                  </button>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>

                {/* Product Creation Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mt-4 space-y-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter product description"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={form.price}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0.00"
                          required
                        />
                        <span className="absolute right-3 top-2 text-gray-500">USD</span>
                      </div>
                    </div>

                    {/* Variants Section */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Product Variants
                      </h4>
                      {Object.entries(catalogVariants).map(([variantName, options]) => (
                        <div key={variantName} className="border-b pb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{variantName}</span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {options.map((option) => (
                              <label key={option} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  onChange={() => handleVariantChange(variantName, option)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hidden field for design data */}
                    <input
                      type="hidden"
                      id="custom-design-data"
                      value={form.designData}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, designData: e.target.value }))
                      }
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Product
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .canvas-delete-btn {
          position: absolute;
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          z-index: 1000;
          color: #ef4444;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        .canvas-delete-btn:hover {
          transform: scale(1.1);
          background-color: #fee2e2;
        }
        .print-area-warning {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ef4444;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
        }
      `}
      </style>
    </>
  );
}