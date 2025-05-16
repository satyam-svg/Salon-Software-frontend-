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
import { AnimatedButton } from "@/Components/ui/Button";

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
    <div className="min-h-screen p-8 mb-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch?.id || ""}
            onChange={(e) => {
              const branch = branches.find((b) => b.id === e.target.value);
              setSelectedBranch(branch || null);
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
            onClick={handleAddService}
            variant="solid"
            gradient={["#b76e79", "#d8a5a5"]}
            hoverScale={1.05}
            tapScale={0.95}
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
            icon={<FiPlus className="text-lg" />}
            iconPosition="left"
          >
            Add Service
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
              <FiList className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Services</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {totalServices}
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
              <FiClock className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Avg. Duration</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                {averageTime.toFixed(0)} min
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
              <p className="text-[#9e6d70]">Total Value</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e8c4c0]">
        <div className="p-6 border-b border-[#e8c4c0]">
          <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
            Service Management
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fff0ee]">
              <tr>
                <th className="p-4 text-left text-[#7a5a57] font-medium">
                  Service Name
                </th>
                <th className="p-4 text-left text-[#7a5a57] font-medium">
                  Duration
                </th>
                <th className="p-4 text-left text-[#7a5a57] font-medium">
                  Price
                </th>
                <th className="p-4 text-left text-[#7a5a57] font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedBranch?.service.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-[#e8c4c0] hover:bg-[#fff0ee] group transition-colors"
                >
                  <td className="p-4 font-medium text-[#7a5a57]">
                    {service.service_name}
                  </td>
                  <td className="p-4 text-[#9e6d70]">{service.time} min</td>
                  <td className="p-4 text-[#b76e79] font-bold">
                    ${service.service_price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-[#7a5a57] hover:text-[#b76e79] transition-colors"
                    >
                      <FiEdit size={18} />
                    </button>
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
              className="bg-white p-8 rounded-2xl w-full max-w-md border border-[#e8c4c0]"
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#7a5a57] font-dancing">
                {editingService ? "Edit Service" : "New Service"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                    value={formData.service_name}
                    onChange={(e) =>
                      setFormData({ ...formData, service_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
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
                    <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                      Service Price
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
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
                <AnimatedButton
                  onClick={handleSubmit}
                  isLoading={formLoading}
                  variant="solid"
                  gradient={["#b76e79", "#d8a5a5"]}
                  hoverScale={1.05}
                  tapScale={0.95}
                  className="flex-1 py-3"
                >
                  {formLoading
                    ? "Processing..."
                    : editingService
                    ? "Update Service"
                    : "Create Service"}
                </AnimatedButton>

                <AnimatedButton
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setFormData({
                      service_name: "",
                      time: 0,
                      service_price: 0,
                    });
                  }}
                  variant="outline"
                  className="flex-1 py-3 text-[#7a5a57] border-[#e8c4c0]"
                  hoverScale={1.05}
                  tapScale={0.95}
                >
                  Cancel
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceManagementPage;
