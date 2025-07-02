"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function DesignEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [color, setColor] = useState("#000000");
  const [recentImages, setRecentImages] = useState([]);
  const [productType, setProductType] = useState("tshirt");
  const formRef = useRef(null);

  const printAreas = {
    tshirt: {
      width: 200,
      height: 200,
      left: 280,
      top: 150,
      fill: "rgba(255,255,255,0)",
      stroke: "red",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      hoverCursor: "default",
      zIndex: 99,
    },
    mug: {
      width: 200,
      height: 120,
      left: 300,
      top: 240,
      fill: "rgba(255,255,255,0)",
      stroke: "blue",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      zIndex: 99,
    },
    bottle: {
      width: 150,
      height: 300,
      left: 325,
      top: 150,
      fill: "rgba(255,255,255,0)",
      stroke: "green",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      zIndex: 99,
    },
  };

  // Load Fabric.js
  useEffect(() => {
    const loadFabric = async () => {
      if (!window.fabric) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js";
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
    if (fabric && canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        selection: true,
        preserveObjectStacking: true,
      });
      setCanvas(newCanvas);
      setupCanvas(newCanvas, productType);
      return () => {
        newCanvas.dispose();
      };
    }
  }, [fabric, productType]);

  // Load recent images
  useEffect(() => {
    const cached = localStorage.getItem("recentImages");
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
    const imageSrc = "/images/tshirt.png"; // Adjust path as needed
    fabric.Image.fromURL(
      imageSrc,
      (img) => {
        img.scaleToWidth(canvasInstance.width * 0.9);
        img.set({
          left: canvasInstance.width / 2,
          top: canvasInstance.height / 2,
          originX: "center",
          originY: "center",
          selectable: false,
          hasControls: false,
          hasBorders: false,
          name: "base-image",
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        });
        canvasInstance.add(img);
        canvasInstance.sendToBack(img);
      },
      { crossOrigin: "anonymous" }
    );
  };

  // Enhanced print area setup with visual feedback
  const setupPrintArea = (canvasInstance, type, showBorder = true) => {
    const existingArea = canvasInstance
      .getObjects()
      .find((obj) => obj.name === "print-area");
    if (existingArea) {
      canvasInstance.remove(existingArea);
    }

    if (printAreas[type]) {
      const config = printAreas[type];

      // Add semi-transparent fill for better visual guidance
      const area = new fabric.Rect({
        name: "print-area",
        ...config,
        fill: "rgba(200, 200, 255, 0.2)", // More visible than fully transparent
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

      // Add text label
      const label = new fabric.Text("Customization Area", {
        left: config.left,
        top: config.top - 20,
        fontSize: 14,
        fill: config.stroke,
        originX: "center",
        selectable: false,
        evented: false,
      });
      canvasInstance.add(label);

      canvasInstance.renderAll();
    }
  };
  const setupObjectControls = (canvasInstance) => {
    canvasInstance.on("selection:created", () =>
      addDeleteControl(canvasInstance)
    );
    canvasInstance.on("selection:updated", () =>
      addDeleteControl(canvasInstance)
    );
    canvasInstance.on("selection:cleared", removeDeleteControl);
    canvasInstance.on("object:moving", () => {
      const warning = document.querySelector(".print-area-warning");
      if (!validateDesignPosition(canvasInstance)) {
        if (!warning) {
          const warnEl = document.createElement("div");
          warnEl.className = "print-area-warning";
          warnEl.textContent = "Design is outside printable area";
          canvasInstance.wrapperEl.appendChild(warnEl);
        }
      } else {
        if (warning) warning.remove();
      }
    });
    canvasInstance.on("object:modified", () => {
      const warning = document.querySelector(".print-area-warning");
      if (warning) warning.remove();
    });
  };

  const addDeleteControl = (canvasInstance) => {
    const activeObject = canvasInstance.getActiveObject();
    if (activeObject && !activeObject.name.includes("base")) {
      addDeleteButtonToObject(canvasInstance, activeObject);
    }
  };

  const removeDeleteControl = () => {
    const deleteBtn = document.querySelector(".canvas-delete-btn");
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
    const deleteBtn = document.createElement("div");
    deleteBtn.className = "canvas-delete-btn";
    deleteBtn.innerHTML = "✕";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.left = `${objLeft + objWidth / 2 - 10}px`;
    deleteBtn.style.top = `${objTop - objHeight / 2 - 15}px`;
    deleteBtn.style.width = "20px";
    deleteBtn.style.height = "20px";
    deleteBtn.style.backgroundColor = "white";
    deleteBtn.style.borderRadius = "50%";
    deleteBtn.style.display = "flex";
    deleteBtn.style.alignItems = "center";
    deleteBtn.style.justifyContent = "center";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    deleteBtn.style.zIndex = "1000";
    deleteBtn.style.color = "red";
    deleteBtn.style.fontWeight = "bold";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      canvasInstance.remove(obj);
      canvasInstance.discardActiveObject();
      canvasInstance.renderAll();
      deleteBtn.remove();
    });
    canvasInstance.wrapperEl.appendChild(deleteBtn);
    obj.on("moving", () => {
      const newLeft = obj.left;
      const newTop = obj.top;
      deleteBtn.style.left = `${newLeft + objWidth / 2 - 10}px`;
      deleteBtn.style.top = `${newTop - objHeight / 2 - 15}px`;
    });
    obj.on("removed", () => {
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
      fontFamily: "Arial, sans-serif",
      hasControls: true,
      originX: "center",
      originY: "center",
      name: "emoji",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    // Close modal (assuming Bootstrap is handling it)
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("emojiModal")
    );
    if (modal) modal.hide();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      cacheImage(file.name, file.type, file.size, f.target.result);
      fabric.Image.fromURL(
        f.target.result,
        (img) => {
          img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: "center",
            originY: "center",
            scaleX: 0.5,
            scaleY: 0.5,
            hasRotatingPoint: true,
            cornerSize: 12,
            transparentCorners: false,
            padding: 10,
            cornerColor: "#4a89dc",
            borderColor: "#4a89dc",
            name: "custom-image",
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
  };

  const cacheImage = (name, type, size, dataURL) => {
    const updatedImages = [...recentImages];
    const existingIndex = updatedImages.findIndex((img) => img.name === name);
    if (existingIndex >= 0) {
      updatedImages[existingIndex] = {
        name,
        type,
        size,
        data: dataURL,
        lastModified: Date.now(),
      };
    } else {
      updatedImages.push({
        name,
        type,
        size,
        data: dataURL,
        lastModified: Date.now(),
      });
    }
    const sorted = updatedImages
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, 5);
    setRecentImages(sorted);
    localStorage.setItem("recentImages", JSON.stringify(sorted));
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Your Text Here", {
      left: canvas.width / 2,
      top: canvas.height / 2,
      width: 150,
      fontSize: 20,
      fill: color,
      fontFamily: "Arial",
      hasControls: true,
      padding: 5,
      backgroundColor: "rgba(255,255,255,0.7)",
      originX: "center",
      originY: "center",
      name: "custom-text",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const updateTextColor = (e) => {
    setColor(e.target.value);
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", e.target.value);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && !activeObject.name.includes("base")) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const validateDesignPosition = (canvasInstance) => {
    const printArea = canvasInstance
      .getObjects()
      .find((obj) => obj.name === "print-area");
    if (!printArea) return true;
    const customObjects = canvasInstance
      .getObjects()
      .filter((obj) => obj.name && obj.name.includes("custom"));
    return customObjects.every((obj) => {
      const objBounds = {
        left: obj.left - (obj.width * obj.scaleX) / 2,
        right: obj.left + (obj.width * obj.scaleX) / 2,
        top: obj.top - (obj.height * obj.scaleY) / 2,
        bottom: obj.top + (obj.height * obj.scaleY) / 2,
      };
      const areaBounds = {
        left: printArea.left - printArea.width / 2,
        right: printArea.left + printArea.width / 2,
        top: printArea.top - printArea.height / 2,
        bottom: printArea.top + printArea.height / 2,
      };
      return (
        objBounds.right <= areaBounds.right &&
        objBounds.left >= areaBounds.left &&
        objBounds.bottom <= areaBounds.bottom &&
        objBounds.top >= areaBounds.top
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canvas) return;
    const customObjects = canvas
      .getObjects()
      .filter((obj) => obj.name && obj.name.includes("custom"));
    if (customObjects.length === 0) {
      alert(
        "Please add at least one customization (text or image) before saving!"
      );
      return;
    }
    if (!validateDesignPosition(canvas)) {
      alert(
        "Some design elements are outside the printable area. Please adjust them before saving."
      );
      return;
    }
    const printArea = canvas
      .getObjects()
      .find((obj) => obj.name === "print-area");
    if (printArea) {
      printArea.set({ stroke: "transparent", fill: "transparent" });
      canvas.renderAll();
    }
    setTimeout(() => {
      const dataURL = canvas.toDataURL({ format: "png", quality: 1.0 });
      console.log("Design saved:", dataURL); // Replace with actual form submission
      // Optionally, reset the print area border
      setupPrintArea(canvas, productType);
    }, 100);
  };

  const deleteCachedImage = (fileName) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      const updatedImages = recentImages.filter((img) => img.name !== fileName);
      setRecentImages(updatedImages);
      localStorage.setItem("recentImages", JSON.stringify(updatedImages));
      canvas
        ?.getObjects()
        .filter(
          (obj) => obj.name === "custom-image" && obj.src?.includes(fileName)
        )
        .forEach((obj) => canvas.remove(obj));
      canvas?.renderAll();
    }
  };

  return (
    <>
      <Head>
        <title>Design Editor</title>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Design Your Product</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              width="800"
              height="600"
              className="border border-gray-300"
            ></canvas>
          </div>
          <div className="w-full md:w-1/3">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="tshirt">T-Shirt</option>
                <option value="mug">Mug</option>
                <option value="bottle">Bottle</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={color}
                onChange={updateTextColor}
                className="w-full h-10 border rounded"
              />
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={addText}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Text
              </button>
              <button
                onClick={() => document.getElementById("fileUpload").click()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Upload Image
              </button>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={deleteSelected}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Selected
              </button>
            </div>
            <div className="mb-4">
              <button
                type="button"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                data-bs-toggle="modal"
                data-bs-target="#emojiModal"
              >
                Add Emoji
              </button>
            </div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Save Design
              </button>
            </form>
            <div className="mt-4">
              <h5 className="text-lg font-medium">Recent Images</h5>
              <div className="grid grid-cols-2 gap-2">
                {recentImages.map((file) => (
                  <div key={file.name} className="relative">
                    <img
                      src={file.data}
                      alt={file.name}
                      className="w-full h-20 object-cover rounded cursor-pointer"
                      onClick={() => {
                        fabric.Image.fromURL(
                          file.data,
                          (img) => {
                            img.set({
                              left: canvas?.width / 2,
                              top: canvas?.height / 2,
                              originX: "center",
                              originY: "center",
                              scaleX: 0.5,
                              scaleY: 0.5,
                              hasRotatingPoint: true,
                              cornerSize: 12,
                              transparentCorners: false,
                              padding: 10,
                              cornerColor: "#4a89dc",
                              borderColor: "#4a89dc",
                              name: "custom-image",
                              src: file.data,
                            });
                            canvas?.add(img);
                            canvas?.setActiveObject(img);
                            canvas?.renderAll();
                          },
                          { crossOrigin: "anonymous" }
                        );
                      }}
                    />
                    <div className="text-xs truncate">
                      {file.name.length > 15
                        ? file.name.substring(0, 12) + "..."
                        : file.name}
                    </div>
                    <button
                      onClick={() => deleteCachedImage(file.name)}
                      className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="emojiModal"
        tabIndex="-1"
        aria-labelledby="emojiModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="emojiModalLabel">
                Select an Emoji
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                id="emojiSearch"
                type="text"
                placeholder="Search emojis..."
                className="w-full p-2 border rounded mb-2"
                onInput={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  document
                    .querySelectorAll(".emoji-option")
                    .forEach((emojiEl) => {
                      const emojiName = emojiEl
                        .querySelector(".emoji-name")
                        ?.textContent.toLowerCase();
                      emojiEl.style.display = emojiName?.includes(searchTerm)
                        ? "block"
                        : "none";
                    });
                }}
              />
              <div className="grid grid-cols-4 gap-2">
                {["😊", "👍", "❤️", "🎉"].map((emoji) => (
                  <div
                    key={emoji}
                    className="emoji-option cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => addEmoji(emoji)}
                    data-emoji={emoji}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <div className="emoji-name text-xs">{emoji}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
