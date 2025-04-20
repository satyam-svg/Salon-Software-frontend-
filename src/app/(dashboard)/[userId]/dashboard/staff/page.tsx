"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiChevronDown,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { usePathname } from "next/navigation";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface BranchResponse {
  id: string;
  branch_name: string;
  branch_location: string;
  salon_id: string;
  contact_email: string;
  contact_number: string;
  opning_time: string;
  closeings_time: string;
}
interface ClientResponse {
  id: string;
  client_name: string;
  email: string;
  contact: string;
  branch_id: string;
  staff_id?: string;
  createdAt: string; // or Date if you parse it
}
interface AppointmentResponse {
  id: string;
  salon_id: string;
  branch_id: string;
  staff_id: string;
  service_id: string;
  client_id: string;
  date: string;
  time: string;
  status: string;
  salon: SalonResponse;
  branch: BranchResponse;
  staff: StaffResponse;
  service: ServiceResponse;
  client: ClientResponse;
}
interface SalonResponse {
  id: string;
  salon_name: string;
  salon_tag: string;
  opening_time?: string;
  contact_email: string;
  contact_number: string;
  branch_url?: string;
  salon_img_url?: string;
}
interface StaffResponse {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  password: string;
  profile_img: string;
  staff_id: string;
}

interface ServiceResponse {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
  staff_id: string;
}

interface Branchapiresponse {
  id: string;
  branch_name: string;
  branch_location: string;
  contact_email: string;
  contact_number: string;
  opning_time: string;
  closeings_time: string;
  staff: StaffResponse[];
  service: ServiceResponse[];
}

const StaffManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchresponse, setbranchresponse] = useState<Branchapiresponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branchapiresponse>();
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [revenue, setrevnue] = useState(0);
  const [avgrevenue, setavgrevenue] = useState(0);
  const [salonid, setsalonid] = useState("");
  const [appointment, setappointments] = useState<AppointmentResponse[]>([]);

  const getrevenuegenrated = (id: string) => {
    let revenue = 0;
    appointment.find((a) => {
      if (a.staff.id == id) {
        revenue += a.service.service_price;
      }
    });
    return revenue;
  };

  // Calculate staff statistics
  const calculateStaffStats = (staff: StaffResponse) => {
    const revenueGenerated =
      selectedBranch?.service
        .filter((service) => service.staff_id === staff.id)
        .reduce((sum, service) => sum + service.service_price, 0) || 0;

    return { revenueGenerated };
  };
  useEffect(() => {
    const getappointment = async () => {
      const response = await axios.get(
        `https://salon-backend-3.onrender.com/api/appoiment/${salonid}`
      );
      if (response.data.appointments) {
        const data = response.data.appointments;
        setappointments(data);
      }
    };
    getappointment();
  }, [salonid]);
  // Filtered Staff
  const filteredStaffs =
    selectedBranch?.staff.filter((staff) =>
      staff.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Statistics Calculations
  const totalStaff = selectedBranch?.staff.length || 0;

  const fetchBranches = useCallback(async () => {
    try {
      const userResponse = await fetch(
        `https://salon-backend-3.onrender.com/api/users/${userId}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user?.salonId);
      const response = await fetch(
        "https://salon-backend-3.onrender.com/api/branch/isbranch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: userData.user.salonId }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setbranchresponse(data.branches || []);
      if (data.branches?.length > 0) {
        setSelectedBranch(data.branches[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Performance Chart Data

  useEffect(() => {
    let sum = 0;
    appointment.forEach((a) => {
      sum += a.service.service_price;
    });
    setrevnue(sum);
    setavgrevenue(sum / totalStaff);
  }, [appointment, totalStaff]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 mb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedBranch?.id || ""}
            onChange={(e) => {
              const branch = branchresponse.find(
                (b) => b.id === e.target.value
              );
              if (branch) setSelectedBranch(branch);
            }}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500"
          >
            {branchresponse.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl flex-1 max-w-md border-2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            className="bg-transparent w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiUsers className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Staff</p>
              <p className="text-2xl font-bold">{totalStaff}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiDollarSign className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${revenue}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiUsers className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Avg. Revenue/Staff</p>
              <p className="text-2xl font-bold">
                $
                {avgrevenue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Staff Performance Overview</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Staff Member</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Revenue Generated</th>

                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map((staff) => {
                const { revenueGenerated } = calculateStaffStats(staff);
                return (
                  <tr
                    key={staff.id}
                    className="border-t border-gray-100 hover:bg-gray-50 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={staff.profile_img || "/default-avatar.png"}
                          alt={staff.fullname}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                        />
                        <div>
                          <p className="font-medium">{staff.fullname}</p>
                          <p className="text-sm text-gray-500">
                            {staff.staff_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm">{staff.contact}</span>
                        <span className="text-sm text-gray-500">
                          {staff.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-green-600">
                        ${getrevenuegenrated(staff.id).toFixed(2)}
                      </span>
                    </td>

                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-purple-600 hover:text-purple-700"
                        onClick={() =>
                          (window.location.href = `/${userId}/dashboard/staff/${staff.id}`)
                        }
                      >
                        <FiSettings className="text-xl" />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagementPage;
