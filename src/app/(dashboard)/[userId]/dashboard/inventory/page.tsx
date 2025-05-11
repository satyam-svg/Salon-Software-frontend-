// app/dashboard/inventory/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash,
  FiPlus,
  FiChevronDown,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";
import { usePathname } from "next/navigation";

interface Product {
  id: string;
  product_name: string;
  product_quantity: number;
  price: number;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  inventory: Product[];
  usedProducts: UsedProduct[];
}

interface UsedProduct {
  id: string;
  product_name: string;
  price: number;
  quantity_used: number;
  staff: {
    fullname: string;
  };
  appointment: {
    service: {
      service_name: string;
    };
    client: {
      client_name: string;
    };
  };
  date: string;
}

const InventoryPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  const fetchBranches = useCallback(async () => {
    if (!userid || !mounted) return;

    try {
      setLoading(true);
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );

      const userData = userResponse.data;
      if (!userData.user?.salonId) throw new Error("Salon not found");

      const branchResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: userData.user.salonId }
      );

      const branchesData = branchResponse.data.branches || [];
      setBranches(branchesData);
      if (branchesData.length > 0) {
        setSelectedBranch(branchesData[0]);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  }, [userid, mounted]);

  useEffect(() => {
    setMounted(true);
    fetchBranches();
  }, [fetchBranches]);

  // Filtered Products
  const filteredProducts =
    selectedBranch?.inventory.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Filtered Used Products
  const filteredUsedProducts =
    selectedBranch?.usedProducts.filter((product) => {
      if (!selectedDate) return true;
      const productDate = new Date(product.date).toISOString().split("T")[0];
      return productDate === selectedDate;
    }) || [];

  // Statistics Calculations
  const totalProducts = filteredProducts.length;
  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + product.product_quantity * product.price,
    0
  );
  const usedItemsCost = filteredUsedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity_used,
    0
  );

  // Form Handling
  const [formData, setFormData] = useState({
    product_name: "",
    product_quantity: 0,
    price: 0,
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      product_quantity: product.product_quantity,
      price: product.price,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!selectedBranch) return;

    try {
      if (editingProduct) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/updateproduct/${editingProduct.id}`,
          { ...formData, branch_id: selectedBranch.id }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/saveproduct`,
          { ...formData, branch_id: selectedBranch.id }
        );
      }
      fetchBranches();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ product_name: "", product_quantity: 0, price: 0 });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!selectedBranch) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/${id}`
      );
      fetchBranches();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  if (loading) {
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 mb-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch?.id || ""}
            onChange={(e) => {
              const branch = branches.find((b) => b.id === e.target.value);
              if (branch) setSelectedBranch(branch);
            }}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl appearance-none focus:border-purple-500 focus:ring-0"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiPlus className="text-lg" />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiBox className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiDollarSign className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Value</p>
              <p className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiDollarSign className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Used Items Cost</p>
              <p className="text-2xl font-bold">
                ${usedItemsCost.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* All Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">
              Product Management - All Products
            </h2>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl max-w-md w-full">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-4 font-medium">{product.product_name}</td>
                  <td className="p-4">{product.product_quantity}</td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Used Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold">Used Product History</h2>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <FiCalendar className="text-gray-400" />
              <input
                type="date"
                className="bg-transparent focus:outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Staff</th>
                <th className="p-4 text-left">Quantity Used</th>
                <th className="p-4 text-left">Date Used</th>
                <th className="p-4 text-left">Client</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{product.product_name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {product.appointment.service.service_name}
                    </span>
                  </td>
                  <td className="p-4">{product.staff.fullname}</td>
                  <td className="p-4">{product.quantity_used}</td>
                  <td className="p-4">
                    {new Date(product.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {product.appointment.client.client_name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.product_quantity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_quantity: +e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, price: +e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl"
                >
                  {editingProduct ? "Update" : "Create"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({
                      product_name: "",
                      product_quantity: 0,
                      price: 0,
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteProduct(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default InventoryPage;
