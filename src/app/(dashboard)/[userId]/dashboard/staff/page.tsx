"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiDollarSign,
  FiChevronDown,
  FiSearch,
  FiSettings,
  FiBriefcase,
  FiPlus,
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
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import AddStaffModal from "@/Components/AddStaffModal";

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
  salon_id: string;
  staff_id?: string;
  createdAt: string;
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
  profile_img?: string;
  staff_id: string;
  salaries: Salary[];
}

interface ServiceResponse {
  id: string;
  service_name: string;
  service_price: number;
  time: number;
  branch_id: string;
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

interface Salary {
  id: string;
  staff_id: string;
  date: string;
  amount: number;
}

const StaffManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchresponse, setbranchresponse] = useState<Branchapiresponse[]>([]);
  const [selectedBranch, setSelectedBranch] =
    useState<Branchapiresponse | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [revenue, setrevnue] = useState(0);
  const [avgrevenue, setavgrevenue] = useState(0);
  const [salonid, setsalonid] = useState("");
  const [appointment, setappointments] = useState<AppointmentResponse[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalsalary, settotalsalary] = useState(0);

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const getrevenuegenrated = (id: string) => {
    if (!mounted || !appointment.length) return 0;
    return appointment
      .filter((a) => a.staff.id === id)
      .reduce((sum, a) => sum + a.service.service_price, 0);
  };

  const salaryrecieve = (id: string) => {
    if (!mounted || !selectedBranch) return 0;
    return (
      selectedBranch.staff
        .find((s) => s.id === id)
        ?.salaries?.reduce((sum, a) => sum + a.amount, 0) || 0
    );
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length > 1) {
        setUserId(pathParts[1]);
      }
    }
  }, [pathname, mounted]);

  useEffect(() => {
    const getappointment = async () => {
      if (!salonid || !mounted) return;
      try {
        const response = await axios.get(
          `https://salon-backend-3.onrender.com/api/appoiment/${salonid}`
        );
        if (response.data.appointments) {
          setappointments(response.data.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    getappointment();
  }, [salonid, mounted]);

  const fetchBranches = useCallback(async () => {
    if (!userId || !mounted) return;

    try {
      setLoading(true);
      const userResponse = await axios.get(
        `https://salon-backend-3.onrender.com/api/users/${userId}`
      );

      const userData = userResponse.data;
      if (!userData.user?.salonId) throw new Error("Salon not found");

      setsalonid(userData.user.salonId);

      const branchResponse = await axios.post(
        "https://salon-backend-3.onrender.com/api/branch/isbranch",
        { salon_id: userData.user.salonId }
      );

      setbranchresponse(branchResponse.data.branches || []);
      if (branchResponse.data.branches?.length > 0) {
        setSelectedBranch(branchResponse.data.branches[0]);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, mounted]);

  useEffect(() => {
    let salary = 0;
    selectedBranch?.staff?.forEach((s) => {
      // Handle case where salary might be undefined
      (s.salaries || []).forEach((a) => {
        salary += a.amount;
      });
    });
    settotalsalary(salary);
  }, [selectedBranch]);

  useEffect(() => {
    if (mounted && userId) {
      fetchBranches();
    }
  }, [fetchBranches, userId, mounted]);

  useEffect(() => {
    if (mounted && appointment.length > 0 && selectedBranch?.staff) {
      const sum = appointment.reduce(
        (acc, a) => acc + a.service.service_price,
        0
      );
      setrevnue(sum);
      setavgrevenue(
        selectedBranch.staff.length > 0 ? sum / selectedBranch.staff.length : 0
      );
    }
  }, [appointment, selectedBranch, mounted]);

  const filteredStaffs =
    selectedBranch?.staff.filter((staff) =>
      staff.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalStaff = selectedBranch?.staff.length || 0;

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 mb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 mb-16">
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => {
          fetchBranches();
          setIsAddStaffModalOpen(false);
        }}
        selectedBranch={selectedBranch}
      />
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          {selectedBranch && (
            <select
              value={selectedBranch.id}
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
          )}
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
          onClick={() => setIsAddStaffModalOpen(true)}
        >
          <FiPlus className="text-lg" />
          <span>Add Staff</span>
        </motion.button>
      </div>

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
              <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiBriefcase className="text-2xl text-red-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Salary</p>
              <p className="text-2xl font-bold">${totalsalary}</p>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Staff Performance Overview</h2>
        </div>

        {filteredStaffs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Staff Member</th>
                  <th className="p-4 text-left">Contact</th>
                  <th className="p-4 text-left">Revenue Generated</th>
                  <th className="p-4 text-left">Salary Received</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffs.map((staff) => (
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
                        ${getrevenuegenrated(staff.id).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-green-600">
                        ${salaryrecieve(staff.id).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-purple-600 hover:text-purple-700"
                        onClick={() =>
                          router.push(`/${userId}/dashboard/staff/${staff.id}`)
                        }
                      >
                        <FiSettings className="text-xl" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            {searchQuery
              ? "No matching staff found"
              : "No staff members found in this branch"}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagementPage;
