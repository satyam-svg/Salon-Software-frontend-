"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiTrash,
  FiPlus,
  FiPhone,
  FiMail,
} from "react-icons/fi";

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  services_offered: string[];
  contact_email: string;
  contact_number: string;
  opening_time: string;
  closing_time: string;
  total_revenue: number;
  appointments_count: number;
}

const dummyBranches: Branch[] = [
  {
    id: "1",
    branch_name: "Downtown Luxury Salon",
    branch_location: "123 Main St, Downtown",
    services_offered: [
      "Hair Coloring",
      "Spa Treatments",
      "Bridal Packages",
      "Men's Grooming",
    ],
    contact_email: "downtown@luxurysalon.com",
    contact_number: "+1 555-1234",
    opening_time: "09:00",
    closing_time: "20:00",
    total_revenue: 25400,
    appointments_count: 345,
  },
  {
    id: "2",
    branch_name: "Uptown Style Hub",
    branch_location: "456 Oak Ave, Uptown",
    services_offered: ["Hair Extensions", "Makeup Artistry", "Kids Styling"],
    contact_email: "uptown@luxurysalon.com",
    contact_number: "+1 555-5678",
    opening_time: "10:00",
    closing_time: "19:00",
    total_revenue: 18200,
    appointments_count: 234,
  },
  {
    id: "3",
    branch_name: "Suburban Beauty Lounge",
    branch_location: "789 Pine Rd, Suburbs",
    services_offered: ["Skin Care", "Waxing", "Massage Therapy"],
    contact_email: "suburbs@luxurysalon.com",
    contact_number: "+1 555-9012",
    opening_time: "08:30",
    closing_time: "18:30",
    total_revenue: 16750,
    appointments_count: 198,
  },
];

export default function BranchManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [minRevenue, setMinRevenue] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch dummy data
  useEffect(() => {
    setTimeout(() => {
      setBranches(dummyBranches);
      setFilteredBranches(dummyBranches);
    }, 500);
  }, []);

  // Filter branches
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = branches.filter((branch) => {
        const matchesSearch = [
          branch.branch_name.toLowerCase(),
          branch.branch_location.toLowerCase(),
          branch.services_offered.join(" ").toLowerCase(),
          branch.contact_email.toLowerCase(),
          branch.total_revenue.toString(),
        ].some((value) => value.includes(searchQuery.toLowerCase()));

        const matchesAdvanced = [
          minRevenue ? branch.total_revenue >= parseInt(minRevenue) : true,
        ].every(Boolean);

        return matchesSearch && matchesAdvanced;
      });

      setFilteredBranches(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, branches, minRevenue]);

  // Scroll progress
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const handleScroll = () => {
      const scrollTop = table.scrollTop;
      const scrollHeight = table.scrollHeight - table.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    table.addEventListener("scroll", handleScroll);
    return () => table.removeEventListener("scroll", handleScroll);
  }, []);

  // Add new branch
  const handleAddBranch = () => {
    if (
      !newBranch.branch_name ||
      !newBranch.branch_location ||
      !newBranch.contact_email ||
      !newBranch.contact_number
    ) {
      alert("Please fill all required fields");
      return;
    }

    const branch: Branch = {
      id: Math.random().toString(36).substr(2, 9),
      branch_name: newBranch.branch_name,
      branch_location: newBranch.branch_location,
      services_offered: newBranch.services_offered || [],
      contact_email: newBranch.contact_email,
      contact_number: newBranch.contact_number,
      opening_time: newBranch.opening_time || "09:00",
      closing_time: newBranch.closing_time || "18:00",
      total_revenue: newBranch.total_revenue || 0,
      appointments_count: newBranch.appointments_count || 0,
    };

    setBranches([...branches, branch]);
    setIsAddingBranch(false);
    setNewBranch({});
  };

  // Service tag colors
  const serviceColors: { [key: string]: string } = {
    "Hair Coloring": "bg-purple-100 text-purple-800",
    "Spa Treatments": "bg-blue-100 text-blue-800",
    "Bridal Packages": "bg-pink-100 text-pink-800",
    "Men's Grooming": "bg-green-100 text-green-800",
    "Hair Extensions": "bg-red-100 text-red-800",
    "Makeup Artistry": "bg-yellow-100 text-yellow-800",
    "Kids Styling": "bg-indigo-100 text-indigo-800",
    "Skin Care": "bg-orange-100 text-orange-800",
    Waxing: "bg-teal-100 text-teal-800",
    "Massage Therapy": "bg-cyan-100 text-cyan-800",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      {/* Add Branch Modal */}
      <AnimatePresence>
        {isAddingBranch && (
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
                <h2 className="text-3xl font-bold mb-6">Add New Branch</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={newBranch.branch_name || ""}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          branch_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={newBranch.branch_location || ""}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          branch_location: e.target.value,
                        })
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
                        value={newBranch.opening_time || "09:00"}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            opening_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded-lg"
                        value={newBranch.closing_time || "18:00"}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            closing_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Services (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., Hair Coloring, Spa Treatments"
                      value={newBranch.services_offered?.join(", ") || ""}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          services_offered: e.target.value
                            .split(", ")
                            .map((s) => s.trim()),
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-lg"
                        value={newBranch.contact_email || ""}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            contact_email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded-lg"
                        value={newBranch.contact_number || ""}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            contact_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsAddingBranch(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBranch}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Branch
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
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
              <p className="text-sm text-gray-500">Avg Revenue</p>
              <p className="text-2xl font-bold">
                $
                {(
                  filteredBranches.reduce(
                    (sum, b) => sum + b.total_revenue,
                    0
                  ) / (filteredBranches.length || 1)
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold">
                {filteredBranches.reduce(
                  (sum, b) => sum + b.appointments_count,
                  0
                )}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <FiClock className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Services/Branch</p>
              <p className="text-2xl font-bold">
                {filteredBranches.length > 0
                  ? (
                      filteredBranches.reduce(
                        (sum, b) => sum + b.services_offered.length,
                        0
                      ) / filteredBranches.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
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
                  Revenue
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
                      {branch.services_offered.map((service) => (
                        <span
                          key={service}
                          className={`px-2 py-1 text-xs rounded-full ${
                            serviceColors[service] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service}
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
                      {branch.opening_time} - {branch.closing_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600">
                      ${branch.total_revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.appointments_count} appointments
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600">
                        <FiEdit />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                        <FiTrash />
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
