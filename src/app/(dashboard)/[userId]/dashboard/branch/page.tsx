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
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { useButtonLoader } from "@/context/buttonloader";
import { AnimatedButton } from "@/Components/ui/Button";

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
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [error, setError] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress] = useState(0);
  const pathname = usePathname();
  const userid = pathname.split("/")[1];
  const [salonid, setsalonid] = useState("");
  const { setButtonLoaderToggle } = useButtonLoader();

  useEffect(() => {
    const getsalonid = async () => {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
    };
    getsalonid();
  }, [userid]);

  const fetchBranches = async () => {
    try {
      setScreenLoaderToggle(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: salonid }
      );
      setBranches(response.data.branches);
      setFilteredBranches(response.data.branches);
    } catch (err) {
      setError("Failed to fetch branches");
      console.log(err);
    } finally {
      setScreenLoaderToggle(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [salonid]);

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

  const handleAddBranch = async () => {
    if (
      !newBranch.branch_name ||
      !newBranch.branch_location ||
      !newBranch.contact_email ||
      !newBranch.contact_number
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setButtonLoaderToggle(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/create`,
        {
          ...newBranch,
          salon_id: salonid,
          opning_time: newBranch.opning_time || "09:00",
          closeings_time: newBranch.closeings_time || "18:00",
        }
      );

      toast.success("Branch added successfully");
      fetchBranches();
      setIsAddingBranch(false);
      setNewBranch({});
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setButtonLoaderToggle(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (!editingBranch) return;

    try {
      setButtonLoaderToggle(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/update/${editingBranch.id}`,
        {
          ...editedBranch,
          opning_time: editedBranch.opning_time,
          closeings_time: editedBranch.closeings_time,
        }
      );
      toast.success("Branch updated successfully");

      setBranches(
        branches.map((b) =>
          b.id === editingBranch.id ? { ...b, ...response.data } : b
        )
      );
      setEditingBranch(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setButtonLoaderToggle(false);
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

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-[#b76e79]">
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
            key="add-branch"
            branch={newBranch}
            onSave={handleAddBranch}
            onClose={() => setIsAddingBranch(false)}
            onFieldChange={handleFieldChange}
          />
        )}

        {editingBranch && (
          <BranchModal
            key={`edit-branch-${editingBranch.id}`}
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
          <h1 className="text-3xl font-bold text-[#7a5a57] font-dancing">
            Branch Management
          </h1>
          <p className="text-[#9e6d70] mt-1">
            Manage salon branches and their operations
          </p>
        </div>

        <div className="flex gap-4">
          <AnimatedButton
            onClick={() => setIsAddingBranch(true)}
            variant="solid"
            gradient={["#b76e79", "#d8a5a5"]}
            hoverScale={1.05}
            tapScale={0.95}
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl w-40"
            icon={<FiPlus className="text-lg" />}
            iconPosition="left"
          >
            Add Branch
          </AnimatedButton>

          <div className="relative">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9e6d70]" />
              <input
                type="text"
                placeholder="Search branches..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#e8c4c0] focus:outline-none focus:border-[#b76e79] text-[#7a5a57] bg-[#fff0ee]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9e6d70] hover:text-[#b76e79]"
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
                  className="mt-2 bg-white p-4 rounded-xl shadow-lg border border-[#e8c4c0]"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                      Min Revenue
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border-2 border-[#e8c4c0] rounded-lg focus:border-[#b76e79] text-[#7a5a57]"
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
        {[
          {
            icon: FiMapPin,
            title: "Total Branches",
            value: filteredBranches.length,
            bg: "#fff0ee",
            color: "#b76e79",
          },
          {
            icon: FiPlus,
            title: "Total Staff",
            value: filteredBranches.reduce((sum, b) => sum + b.staffCount, 0),
            bg: "#fff0ee",
            color: "#d8a5a5",
          },
          {
            icon: FiPlus,
            title: "Total Services",
            value: filteredBranches.reduce((sum, b) => sum + b.serviceCount, 0),
            bg: "#fff0ee",
            color: "#9e6d70",
          },
          {
            icon: FiPlus,
            title: "Total Inventory",
            value: filteredBranches.reduce(
              (sum, b) => sum + b.inventoryCount,
              0
            ),
            bg: "#fff0ee",
            color: "#7a5a57",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#b76e79]"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9e6d70]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#7a5a57]">
                  {stat.value}
                </p>
              </div>
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon className="text-xl" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Branch Table */}
      <div className="relative">
        <div className="absolute right-0 top-0 h-full w-2 bg-[#fff0ee] rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-[#b76e79] rounded-full"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        <div
          ref={tableRef}
          className="overflow-y-auto max-h-[600px] pr-4 scrollbar-hide"
        >
          <table className="w-full relative">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#fff0ee]">
                {[
                  "Branch Name",
                  "Location",
                  "Services",
                  "Contact",
                  "Hours",
                  "Stats",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-medium text-[#7a5a57] uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8c4c0]">
              {filteredBranches.map((branch) => (
                <motion.tr
                  key={branch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#fff0ee]"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#7a5a57]">
                      {branch.branch_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#9e6d70]">
                      <FiMapPin className="text-sm" />
                      {branch.branch_location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {branch.service.map((service) => (
                        <span
                          key={service.id}
                          className="bg-[#e8c4c0] text-[#7a5a57] px-2 py-1 text-xs rounded-full"
                        >
                          {service.service_name} (${service.service_price})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FiMail className="text-sm text-[#9e6d70]" />
                        <span className="text-sm">{branch.contact_email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone className="text-sm text-[#9e6d70]" />
                        <span className="text-sm">{branch.contact_number}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-[#9e6d70]">
                      <FiClock className="text-[#9e6d70]" />
                      {branch.opning_time} - {branch.closeings_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-[#7a5a57]">
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
                        className="p-2 hover:bg-[#fff0ee] rounded-lg text-[#b76e79]"
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
              <div className="text-[#e8c4c0] mb-4">
                <FiMapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-[#7a5a57]">
                No branches found
              </h3>
              <p className="text-[#9e6d70] mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const { ButtonLoaderToggle } = useButtonLoader();
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
        <div className="bg-white p-6 rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-[#e8c4c0]">
          <h2 className="text-3xl font-bold mb-6 text-[#7a5a57] font-dancing">
            {isEditing ? "Edit Branch" : "Add New Branch"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                Branch Name*
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                value={branch.branch_name || ""}
                onChange={(e) => onFieldChange("branch_name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                Location*
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                value={branch.branch_location || ""}
                onChange={(e) =>
                  onFieldChange("branch_location", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                  Opening Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                  value={branch.opning_time || "09:00"}
                  onChange={(e) => onFieldChange("opning_time", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                  Closing Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                  value={branch.closeings_time || "18:00"}
                  onChange={(e) =>
                    onFieldChange("closeings_time", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                  Contact Email*
                </label>
                <input
                  type="email"
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                  value={branch.contact_email || ""}
                  onChange={(e) =>
                    onFieldChange("contact_email", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                  Contact Number*
                </label>
                <input
                  type="tel"
                  className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                  value={branch.contact_number || ""}
                  onChange={(e) =>
                    onFieldChange("contact_number", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <AnimatedButton
              onClick={onClose}
              variant="outline"
              className="px-6 py-3 text-[#7a5a57] hover:bg-[#fff0ee]"
              hoverScale={1.05}
              tapScale={0.95}
            >
              Cancel
            </AnimatedButton>

            <AnimatedButton
              onClick={onSave}
              isLoading={ButtonLoaderToggle}
              variant="solid"
              gradient={["#b76e79", "#d8a5a5"]}
              className="px-6 py-3"
              hoverScale={1.05}
              tapScale={0.95}
            >
              {isEditing
                ? ButtonLoaderToggle
                  ? "Saving..."
                  : "Save Changes"
                : ButtonLoaderToggle
                ? "Adding..."
                : "Add Branch"}
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
