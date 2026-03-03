"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product, ProductFormData } from "@/types/product";
import { formatPrice, generateSlug } from "@/lib/utils";
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    images: [],
    sizes: [],
    category: "Jackets",
    featured: false,
    inStock: true,
  });

  // Get Firebase ID token for authenticated API requests
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error("Failed to load products");
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user, loadProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      images: [],
      sizes: [],
      category: "Jackets",
      featured: false,
      inStock: true,
    });
    setEditingProduct(null);
    setIsAdding(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      images: product.images,
      sizes: product.sizes,
      category: product.category,
      featured: product.featured,
      inStock: product.inStock,
    });
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      slug: generateSlug(formData.name),
    };

    try {
      const authHeaders = await getAuthHeaders();
      if (editingProduct) {
        await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({ ...productData, id: editingProduct.id }),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify(productData),
        });
      }
      await loadProducts();
      resetForm();
    } catch {
      console.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const authHeaders = await getAuthHeaders();
      await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ id }),
      });
      await loadProducts();
    } catch {
      console.error("Failed to delete product");
    }
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const body = new FormData();
      for (let i = 0; i < files.length; i++) {
        body.append("files", files[i]);
      }

      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: authHeaders,
        body,
      });
      if (!res.ok) throw new Error("Upload failed");

      const { urls } = await res.json();
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      setUploadProgress(`${files.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadProgress("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <div className="w-full max-w-sm bg-white p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand">Admin Panel</h1>
            <p className="text-sm text-muted mt-1">Falconia Shop Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="admin@falconia.shop"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted hover:text-brand transition-colors"
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand">
              Product Management
            </h1>
            <p className="text-sm text-muted mt-1">
              {products.length} products total
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm border border-gray-200 text-muted hover:text-brand transition-colors"
            >
              View Store
            </Link>
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="px-6 py-2 bg-brand text-white text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors"
            >
              + Add Product
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-brand">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted hover:text-brand text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand bg-white"
                  >
                    {["Jackets", "Hoodies", "T-Shirts", "Pants"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                    Price (TND) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                    Original Price (TND)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Product Images
                </label>
                <div className="space-y-3">
                  {/* Uploaded image previews */}
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {formData.images.map((url, i) => (
                        <div key={i} className="relative group w-20 h-20">
                          <Image
                            src={url}
                            alt={`Image ${i + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Upload button */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`px-4 py-2 border border-gray-200 text-sm cursor-pointer hover:border-brand transition-colors ${
                        uploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {uploading ? "Uploading..." : "Choose Images"}
                    </label>
                    {uploadProgress && (
                      <span className="text-xs text-muted">{uploadProgress}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[40px] h-10 px-3 text-xs font-medium border transition-all ${
                        formData.sizes.includes(size)
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-muted border-gray-200 hover:border-brand"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-muted">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-muted">In Stock</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="bg-brand text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-surface shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted">
                            {product.sizes.join(", ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-brand">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 ${
                          product.inStock
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.inStock ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {product.inStock ? "In Stock" : "Sold Out"}
                      </span>
                      {product.featured && (
                        <span className="ml-2 text-xs font-medium px-2 py-1 bg-accent/10 text-accent">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs font-medium text-brand hover:text-accent transition-colors px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
