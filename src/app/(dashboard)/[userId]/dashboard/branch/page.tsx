"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCallback } from "react";
import {
  FiSearch,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiPlus,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Service {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  contact_email: string;
  contact_number: string;
  opning_time: string;
  closeings_time: string;
  salon_id: string;
  service: Service[];
  staffCount: number;
  serviceCount: number;
  inventoryCount: number;
  total_revenue?: number;
  appointments_count?: number;
}

export default function BranchManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({});
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editedBranch, setEditedBranch] = useState<Partial<Branch>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [minRevenue, setMinRevenue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress] = useState(0);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const [salonid, setsalonid] = useState("");

  useEffect(() => {
    const getsalonid = async () => {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      console.log(userData);

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
      console.log(userResponse);
    };
    getsalonid();
  }, [userid]);

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: salonid }
      );
      setBranches(response.data.branches);
      setFilteredBranches(response.data.branches);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch branches");
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, [salonid]);

  // Filter branches
  useEffect(() => {
    const filtered = branches.filter((branch) => {
      const matchesSearch = [
        branch.branch_name.toLowerCase(),
        branch.branch_location.toLowerCase(),
        branch.service
          .map((s) => s.service_name)
          .join(" ")
          .toLowerCase(),
        branch.contact_email.toLowerCase(),
        branch.total_revenue?.toString() || "0",
      ].some((value) => value.includes(searchQuery.toLowerCase()));

      const matchesRevenue = minRevenue
        ? (branch.total_revenue || 0) >= parseInt(minRevenue)
        : true;

      return matchesSearch && matchesRevenue;
    });

    setFilteredBranches(filtered);
  }, [searchQuery, branches, minRevenue]);

  // Add new branch
  const handleAddBranch = async () => {
    if (
      !newBranch.branch_name ||
      !newBranch.branch_location ||
      !newBranch.contact_email ||
      !newBranch.contact_number
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/create`,
        {
          ...newBranch,
          salon_id: salonid,
          opning_time: newBranch.opning_time || "09:00",
          closeings_time: newBranch.closeings_time || "18:00",
        }
      );

      toast.success(response.data.message);
      fetchBranches();
      setIsAddingBranch(false);
      setNewBranch({});
    } catch (err) {
      alert("Error adding branch");
      console.log(err);
    }
  };

  // Update branch
  const handleUpdateBranch = async () => {
    if (!editingBranch) return;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/update/${editingBranch.id}`,
        {
          ...editedBranch,
          opning_time: editedBranch.opning_time,
          closeings_time: editedBranch.closeings_time,
        }
      );

      setBranches(
        branches.map((b) =>
          b.id === editingBranch.id ? { ...b, ...response.data } : b
        )
      );
      setEditingBranch(null);
    } catch (err) {
      alert("Error updating branch");
      console.log(err);
    }
  };

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      if (editingBranch) {
        setEditedBranch((prev) => ({ ...prev, [field]: value }));
      } else {
        setNewBranch((prev) => ({ ...prev, [field]: value }));
      }
    },
    [editingBranch]
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-indigo-500"></div>
        <p className="mt-2 text-gray-600">Loading branches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <FiMapPin className="w-16 h-16 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      <AnimatePresence>
        {isAddingBranch && (
          <BranchModal
            key="add-branch" // Unique key for add mode
            branch={newBranch}
            onSave={handleAddBranch}
            onClose={() => setIsAddingBranch(false)}
            onFieldChange={handleFieldChange}
          />
        )}

        {editingBranch && (
          <BranchModal
            key={`edit-branch-${editingBranch.id}`} // Unique key for edit mode
            branch={editedBranch}
            onSave={handleUpdateBranch}
            onClose={() => setEditingBranch(null)}
            isEditing
            onFieldChange={handleFieldChange}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Branch Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage salon branches and their operations
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsAddingBranch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            <FiPlus className="text-lg" />
            <span>Add Branch</span>
          </button>

          <div className="relative">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search branches..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
              >
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Min Revenue
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Minimum revenue"
                      value={minRevenue}
                      onChange={(e) => setMinRevenue(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Branches</p>
              <p className="text-2xl font-bold">{filteredBranches.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
              <FiMapPin className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold">
                {filteredBranches.reduce((sum, b) => sum + b.staffCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiPlus className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-2xl font-bold">
                {filteredBranches.reduce((sum, b) => sum + b.serviceCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiPlus className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inventory</p>
              <p className="text-2xl font-bold">
                {filteredBranches.reduce((sum, b) => sum + b.inventoryCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <FiPlus className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Branch Table */}
      <div className="relative">
        <div className="absolute right-0 top-0 h-full w-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-indigo-500 rounded-full"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        <div
          ref={tableRef}
          className="overflow-y-auto max-h-[600px] pr-4 scrollbar-hide"
        >
          <table className="w-full relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Branch Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Services
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBranches.map((branch) => (
                <motion.tr
                  key={branch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-indigo-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{branch.branch_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiMapPin className="text-sm" />
                      {branch.branch_location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {branch.service.map((service) => (
                        <span
                          key={service.id}
                          className="bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded-full"
                        >
                          {service.service_name} (${service.service_price})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FiMail className="text-sm text-gray-500" />
                        <span className="text-sm">{branch.contact_email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone className="text-sm text-gray-500" />
                        <span className="text-sm">{branch.contact_number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <FiClock className="text-gray-500" />
                      {branch.opning_time} - {branch.closeings_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <strong>{branch.staffCount}</strong> Staff
                      </span>
                      <span className="text-sm">
                        <strong>{branch.serviceCount}</strong> Services
                      </span>
                      <span className="text-sm">
                        <strong>{branch.inventoryCount}</strong> Inventory
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBranch(branch);
                          setEditedBranch({
                            ...branch,
                            opning_time: branch.opning_time,
                            closeings_time: branch.closeings_time,
                          });
                        }}
                        className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600"
                      >
                        <FiEdit />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredBranches.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiMapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No branches found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Branch Modal Component
const BranchModal = React.memo(function BranchModal({
  branch,
  onSave,
  onClose,
  isEditing,
  onFieldChange,
}: {
  branch: Partial<Branch>;
  onSave: () => void;
  onClose: () => void;
  isEditing?: boolean;
  onFieldChange: (field: keyof Branch, value: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="bg-white p-6 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">
            {isEditing ? "Edit Branch" : "Add New Branch"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Name*
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={branch.branch_name || ""}
                onChange={(e) => onFieldChange("branch_name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location*
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={branch.branch_location || ""}
                onChange={(e) =>
                  onFieldChange("branch_location", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-lg"
                  value={branch.opning_time || "09:00"}
                  onChange={(e) => onFieldChange("opning_time", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-lg"
                  value={branch.closeings_time || "18:00"}
                  onChange={(e) =>
                    onFieldChange("closeings_time", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Email*
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={branch.contact_email || ""}
                  onChange={(e) =>
                    onFieldChange("contact_email", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Number*
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-lg"
                  value={branch.contact_number || ""}
                  onChange={(e) =>
                    onFieldChange("contact_number", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {isEditing ? "Save Changes" : "Add Branch"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
