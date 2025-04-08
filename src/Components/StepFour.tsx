"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import {
  FiPackage,
  FiMapPin,
  FiClock,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";

interface Branch {
  id: string;
  name: string;
  location: string;
  openingTime: string;
  closingTime: string;
  email: string;
  contact: string;
  serviceCount: number;
  inventoryCount: number;
}

interface BranchAPIResponse {
  id: string;
  branch_name: string;
  branch_location: string;
  opning_time: string;
  closeings_time: string;
  contact_email: string;
  contact_number: string;
  serviceCount: number;
  inventoryCount: number;
}

interface ProductFormData {
  product_name: string;
  product_quantity: number;
  price: number;
}

interface ServiceFormData {
  service_name: string;
  service_price: number;
  time: string;
}

interface InventoryModalState {
  isOpen: boolean;
  type: "product" | "service" | null;
  branch: Branch | null;
}

export default function StepFour({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [salonId, setSalonId] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formloading, setformloading] = useState(false);
  const [modalState, setModalState] = useState<InventoryModalState>({
    isOpen: false,
    type: null,
    branch: null,
  });

  const {
    register: productRegister,
    handleSubmit: handleProductSubmit,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductFormData>();

  const {
    register: serviceRegister,
    handleSubmit: handleServiceSubmit,
    reset: resetService,
    formState: { errors: serviceErrors },
  } = useForm<ServiceFormData>();
  const fetchBranches = async () => {
    try {
      const userResponse = await fetch(
        `https://salon-backend-3.onrender.com/api/users/${userId}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setSalonId(userData.user.salonId);

      const branchResponse = await fetch(
        "https://salon-backend-3.onrender.com/api/branch/isbranch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: userData.user.salonId }),
        }
      );

      const branchData = await branchResponse.json();
      if (branchData.isbranch) {
        setBranches(
          branchData.branches.map((branch: BranchAPIResponse) => ({
            id: branch.id,
            name: branch.branch_name,
            location: branch.branch_location,
            openingTime: branch.opning_time,
            closingTime: branch.closeings_time,
            email: branch.contact_email,
            contact: branch.contact_number,
            serviceCount: branch.serviceCount,
            inventoryCount: branch.inventoryCount,
          }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };
  const updateStep = async () => {
    const salonData = {
      salonId: salonId,
      step: 4,
      user_id: userId,
    };

    // Submit to backend
    const response = await fetch(
      "https://salon-backend-3.onrender.com/api/salon/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salonData),
      }
    );
    console.log(response);
    setStep(5);
  };
  useEffect(() => {
    if (userId) fetchBranches();
  }, [userId]);

  const handleInventoryClick = (
    type: "product" | "service",
    branch: Branch
  ) => {
    setModalState({ isOpen: true, type, branch });
  };

  const closeModal = () => {
    fetchBranches();
    setModalState({ isOpen: false, type: null, branch: null });
    resetProduct();
    resetService();
  };

  const saveProduct = async (data: ProductFormData) => {
    setformloading(true);
    try {
      // Replace with your actual product API endpoint
      const response = await fetch(
        "https://salon-backend-3.onrender.com/api/inventry/saveproduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            branch_id: modalState.branch?.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save product");
      closeModal();
    } catch (error) {
      setformloading(false);
      console.error("Save product error:", error);
    }
    setformloading(false);
  };

  const saveService = async (data: ServiceFormData) => {
    setformloading(true);
    try {
      // Replace with your actual service API endpoint
      const response = await fetch(
        "https://salon-backend-3.onrender.com/api/inventry/saveservice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            branch_id: modalState.branch?.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save service");
      closeModal();
    } catch (error) {
      setformloading(false);
      console.error("Save service error:", error);
    }
    setformloading(false);
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300"
        >
          Loading branches...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-rose-500">
        {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Manage Inventory
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-300 text-lg"
        >
          Add products and services to each branch
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {branch.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-rose-400" />
                    <span className="truncate">{branch.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-emerald-400" />
                    <span>
                      {branch.openingTime} - {branch.closingTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdMiscellaneousServices className="text-emerald-400 text-xl" />
                    <span> Service Count :-{branch.serviceCount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaBoxOpen className="text-emerald-400 text-xl" />
                    <span>Product Count :- {branch.inventoryCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInventoryClick("product", branch)}
                  className="w-full bg-rose-50 text-rose-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiPackage className="text-lg" />
                  Add Products
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInventoryClick("service", branch)}
                  className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiShoppingBag className="text-lg" />
                  Add Services
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalState.isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <FiX className="text-xl" />
              </button>

              <h3 className="text-xl font-semibold mb-6">
                Add {modalState.type === "product" ? "Product" : "Service"} to{" "}
                <span className="text-rose-500">{modalState.branch?.name}</span>
              </h3>

              {modalState.type === "product" ? (
                <form
                  onSubmit={handleProductSubmit(saveProduct)}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <input
                      {...productRegister("product_name", {
                        required: "Product name is required",
                      })}
                      placeholder="Product Name"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                    />
                    <FiBox className="absolute right-3 top-3.5 text-gray-400" />
                  </motion.div>
                  {productErrors.product_name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-500 text-sm"
                    >
                      {productErrors.product_name.message}
                    </motion.p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        {...productRegister("product_quantity", {
                          required: "Quantity is required",
                          min: { value: 1, message: "Minimum quantity is 1" },
                        })}
                        placeholder="Quantity"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                      />
                      <FiPackage className="absolute right-3 top-3.5 text-gray-400" />
                    </motion.div>
                    {productErrors.product_quantity && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-sm"
                      >
                        {productErrors.product_quantity.message}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        step="0.01"
                        {...productRegister("price", {
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price must be positive",
                          },
                        })}
                        placeholder="Price"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                      />
                      <FiDollarSign className="absolute right-3 top-3.5 text-gray-400" />
                    </motion.div>
                    {productErrors.price && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-sm"
                      >
                        {productErrors.price.message}
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-3 mt-6"
                  >
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:shadow-lg"
                    >
                      {formloading ? "Saving..." : "Save Product"}
                    </button>
                  </motion.div>
                </form>
              ) : (
                <form
                  onSubmit={handleServiceSubmit(saveService)}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <input
                      {...serviceRegister("service_name", {
                        required: "Service name is required",
                      })}
                      placeholder="Service Name"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                    />
                    <FiShoppingBag className="absolute right-3 top-3.5 text-gray-400" />
                  </motion.div>
                  {serviceErrors.service_name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-500 text-sm"
                    >
                      {serviceErrors.service_name.message}
                    </motion.p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        step="0.01"
                        {...serviceRegister("service_price", {
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price must be positive",
                          },
                        })}
                        placeholder="Price"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                      />
                      <FiDollarSign className="absolute right-3 top-3.5 text-gray-400" />
                    </motion.div>
                    {serviceErrors.service_price && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-sm"
                      >
                        {serviceErrors.service_price.message}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        {...serviceRegister("time", {
                          required: "Duration is required",
                        })}
                        placeholder="Service Time (Min)"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                      />
                    </motion.div>
                    {serviceErrors.time && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-rose-500 text-sm"
                      >
                        {serviceErrors.time.message}
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-3 mt-6"
                  >
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:shadow-lg"
                    >
                      {formloading ? "Saving..." : "Save Service"}
                    </button>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-12 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={() => setStep(2)}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
        >
          <FiChevronLeft />
          Previous Step
        </motion.button>

        <motion.button
          onClick={() => updateStep()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
        >
          Save & Next
          <FiChevronRight className="inline-block ml-2" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
