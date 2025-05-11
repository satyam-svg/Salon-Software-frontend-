"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FiEdit,
  FiPlus,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiList,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import toast from "react-hot-toast";

interface Service {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
  branch_id: string;
}

interface Branch {
  id: string;
  branch_name: string;
  service: Service[];
}

const ServiceManagementPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [formLoading, setFormLoading] = useState(false);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  // Fetch branches data
  const fetchBranches = useCallback(async () => {
    if (!userid) return;

    try {
      setScreenLoaderToggle(true);
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );

      const salonId = userResponse.data.user?.salonId;
      if (!salonId) throw new Error("Salon not found");

      const branchResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: salonId }
      );

      const branchesData: Branch[] = branchResponse.data.branches || [];
      setBranches(branchesData);
      if (branchesData.length > 0) {
        setSelectedBranch(branchesData[0]);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setScreenLoaderToggle(false);
    }
  }, [userid]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Statistics Calculations
  const totalServices = selectedBranch?.service?.length || 0;
  const averageTime = selectedBranch?.service
    ? selectedBranch.service.reduce((sum, service) => sum + service.time, 0) /
      totalServices
    : 0;
  const totalRevenue = selectedBranch?.service
    ? selectedBranch.service.reduce(
        (sum, service) => sum + service.service_price,
        0
      )
    : 0;

  // Form Handling
  const [formData, setFormData] = useState({
    service_name: "",
    time: 0,
    service_price: 0,
  });

  const handleEdit = async (service: Service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      time: service.time,
      service_price: service.service_price,
    });
    setShowModal(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setFormData({ service_name: "", time: 0, service_price: 0 });
    setShowModal(true);
  };

  // Update the handleSubmit function with correct API endpoint
  const handleSubmit = async () => {
    if (!selectedBranch) {
      toast.error("Please select a branch.");
      return;
    }

    setFormLoading(true);
    const loadingToast = toast.loading(
      editingService ? "Updating service..." : "Creating new service..."
    );

    try {
      const payload = {
        ...formData,
        branch_id: selectedBranch.id,
      };

      const url = editingService
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/updateservices/${editingService.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}api/inventry/saveservice`;

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed.");
      }

      toast.success(
        editingService
          ? "🎉 Service updated successfully!"
          : "🚀 New service created successfully!",
        { id: loadingToast }
      );

      await fetchBranches();
      setShowModal(false);
      setEditingService(null);
      setFormData({ service_name: "", time: 0, service_price: 0 });
    } catch (error) {
      console.error("Operation failed:", error);

      toast.error(
        error instanceof Error
          ? `❌ Error: ${error.message}`
          : "❌ An unknown error occurred.",
        { id: loadingToast }
      );
    } finally {
      setFormLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch?.id || ""}
            onChange={(e) => {
              const branch = branches.find((b) => b.id === e.target.value);
              setSelectedBranch(branch || null);
            }}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
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
            onClick={handleAddService}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiPlus className="text-lg" />
            Add Service
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiList className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-xl font-bold">{totalServices}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Time</p>
              <p className="text-xl font-bold">{averageTime.toFixed(0)} min</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Service List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Service Name</th>
                <th className="p-4 text-left">Duration</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedBranch?.service.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-4 font-medium">{service.service_name}</td>
                  <td className="p-4">{service.time} min</td>
                  <td className="p-4">${service.service_price.toFixed(2)}</td>
                  <td className="p-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => handleEdit(service)}
                    >
                      <FiEdit />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
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
                {editingService ? "Edit Service" : "New Service"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                    value={formData.service_name}
                    onChange={(e) =>
                      setFormData({ ...formData, service_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          time: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Service Price
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.service_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  disabled={formLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl disabled:opacity-50"
                >
                  {formLoading
                    ? "Processing..."
                    : editingService
                    ? "Update"
                    : "Create"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setFormData({
                      service_name: "",
                      time: 0,
                      service_price: 0,
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
    </div>
  );
};

export default ServiceManagementPage;
