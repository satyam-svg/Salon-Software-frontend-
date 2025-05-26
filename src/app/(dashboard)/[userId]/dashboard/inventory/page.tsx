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
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { useButtonLoader } from "@/context/buttonloader";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/Components/ui/Button";

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
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [mounted, setMounted] = useState(false);
  const { ButtonLoaderToggle, setButtonLoaderToggle } = useButtonLoader();
  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  const fetchBranches = useCallback(async () => {
    if (!userid || !mounted) return;

    try {
      setScreenLoaderToggle(true);
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
      setScreenLoaderToggle(false);
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
    if (!selectedBranch) {
      toast.error("Please select a branch.");
      return;
    }

    try {
      setButtonLoaderToggle(true);

      if (editingProduct) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/updateproduct/${editingProduct.id}`,
          { ...formData, branch_id: selectedBranch.id }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/saveproduct`,
          { ...formData, branch_id: selectedBranch.id }
        );
        toast.success("Product saved successfully!");
      }

      fetchBranches();
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to save product");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ product_name: "", product_quantity: 0, price: 0 });
      setButtonLoaderToggle(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!selectedBranch) {
      toast.error("Please select a branch.");
      return;
    }

    try {
      setButtonLoaderToggle(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/deleteproduct/${id}`
      );

      toast.success("Product deleted sucessfully");

      fetchBranches();
    } catch (error: unknown) {
      console.error("Error deleting product:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while deleting the product.");
      }
    } finally {
      setShowDeleteConfirm(null);
      setButtonLoaderToggle(false);
    }
  };

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  return (
    <main className="min-h-screen  p-8 mb-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch?.id || ""}
            onChange={(e) => {
              const branch = branches.find((b) => b.id === e.target.value);
              if (branch) setSelectedBranch(branch);
            }}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-[#e8c4c0] rounded-xl appearance-none focus:border-[#b76e79] focus:ring-0 text-[#7a5a57]"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-[#9e6d70]" />
        </div>

        <div className="flex gap-4">
          <AnimatedButton
            onClick={() => setShowModal(true)}
            variant="solid"
            gradient={["#b76e79", "#d8a5a5"]}
            hoverScale={1.05}
            tapScale={0.95}
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
            icon={<FiPlus className="text-lg" />}
            iconPosition="left"
          >
            Add Product
          </AnimatedButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#b76e79]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiBox className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Products</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {totalProducts}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#d8a5a5]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiDollarSign className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Value</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                ₹{totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#9e6d70]"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiDollarSign className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Used Items Cost</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                ₹{usedItemsCost.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* All Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-[#e8c4c0]">
        <div className="p-6 border-b border-[#e8c4c0]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
              Product Management - All Products
            </h2>
            <div className="flex items-center gap-2 bg-[#fff0ee] p-3 rounded-xl max-w-md w-full">
              <FiSearch className="text-[#9e6d70]" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent w-full focus:outline-none text-[#7a5a57] placeholder-[#9e6d70]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fff0ee]">
              <tr>
                {["Product Name", "Quantity", "Price", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="p-4 text-left text-[#7a5a57] font-medium"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[#e8c4c0] hover:bg-[#fff0ee] group transition-colors"
                >
                  <td className="p-4 font-medium text-[#7a5a57]">
                    {product.product_name}
                  </td>
                  <td className="p-4 text-[#9e6d70]">
                    {product.product_quantity}
                  </td>
                  <td className="p-4 text-[#b76e79] font-bold">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-[#7a5a57] hover:text-[#b76e79] transition-colors"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(product.id)}
                      className="text-[#7a5a57] hover:text-[#d8a5a5] transition-colors"
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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e8c4c0]">
        <div className="p-6 border-b border-[#e8c4c0]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
              Used Product History
            </h2>
            <div className="flex items-center gap-2 bg-[#fff0ee] p-3 rounded-xl">
              <FiCalendar className="text-[#9e6d70]" />
              <input
                type="date"
                className="bg-transparent focus:outline-none text-[#7a5a57]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fff0ee]">
              <tr>
                {[
                  "Product Name",
                  "Service",
                  "Staff",
                  "Quantity Used",
                  "Date Used",
                  "Client",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-4 text-left text-[#7a5a57] font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[#e8c4c0] hover:bg-[#fff0ee] transition-colors"
                >
                  <td className="p-4 font-medium text-[#7a5a57]">
                    {product.product_name}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-[#e8c4c0] text-[#7a5a57] rounded-full text-sm">
                      {product.appointment.service.service_name}
                    </span>
                  </td>
                  <td className="p-4 text-[#9e6d70]">
                    {product.staff.fullname}
                  </td>
                  <td className="p-4 text-[#b76e79] font-bold">
                    {product.quantity_used}
                  </td>
                  <td className="p-4 text-[#9e6d70]">
                    {new Date(product.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-[#d8a5a5] text-white rounded-full text-sm">
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
              className="bg-white p-8 rounded-2xl w-full max-w-md border border-[#e8c4c0]"
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#7a5a57] font-dancing">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                    value={formData.product_name}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                      value={formData.product_quantity || ""}
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_quantity: +e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                      value={formData.price || ""}
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, price: +e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <AnimatedButton
                  onClick={handleSubmit}
                  isLoading={ButtonLoaderToggle}
                  variant="solid"
                  gradient={["#b76e79", "#d8a5a5"]}
                  hoverScale={ButtonLoaderToggle ? 1 : 1.05}
                  tapScale={0.95}
                  className="flex-1 py-3 rounded-xl"
                  iconPosition="left"
                  icon={
                    ButtonLoaderToggle ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : null
                  }
                >
                  {editingProduct
                    ? ButtonLoaderToggle
                      ? "Updating..."
                      : "Update"
                    : ButtonLoaderToggle
                    ? "Creating..."
                    : "Create"}
                </AnimatedButton>
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
                  className="flex-1 bg-[#fff0ee] text-[#7a5a57] py-3 rounded-xl"
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
              className="bg-white p-8 rounded-2xl w-full max-w-md border border-[#e8c4c0]"
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#7a5a57] font-dancing">
                Confirm Delete
              </h3>
              <p className="text-[#9e6d70] mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteProduct(showDeleteConfirm)}
                  className="flex-1 bg-[#b76e79] text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {ButtonLoaderToggle && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  {ButtonLoaderToggle ? "Deleting..." : "Delete"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-[#fff0ee] text-[#7a5a57] py-3 rounded-xl"
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
