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
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { AnimatedButton } from "@/Components/ui/Button";

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
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [totalsalary, settotalsalary] = useState(0);

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const getrevenuegenrated = (id: string) => {
    if (!mounted || !appointment.length) return 0;

    return appointment
      .filter(
        (a) =>
          a.status === "confirmed" && // Check status first
          a.staff?.id === id // Safe staff ID check
      )
      .reduce((sum, a) => sum + (a.service?.service_price || 0), 0);
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/${salonid}`
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
      setScreenLoaderToggle(true);
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
      );

      const userData = userResponse.data;
      if (!userData.user?.salonId) throw new Error("Salon not found");

      setsalonid(userData.user.salonId);

      const branchResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/branch/isbranch`,
        { salon_id: userData.user.salonId }
      );

      setbranchresponse(branchResponse.data.branches || []);
      if (branchResponse.data.branches?.length > 0) {
        setSelectedBranch(branchResponse.data.branches[0]);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setScreenLoaderToggle(false);
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
      const sum = appointment
        .filter((a) => a.status === "confirmed") // First filter confirmed appointments
        .reduce(
          (acc, a) => acc + (a.service?.service_price || 0), // Safe price access
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

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  return (
    <div className="min-h-screen p-8 mb-14">
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => {
          fetchBranches();
          setIsAddStaffModalOpen(false);
        }}
        selectedBranch={selectedBranch}
      />

      {/* Header Section */}
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
              className="w-full pl-4 pr-8 py-3 bg-white border-2 border-[#e8c4c0] rounded-xl appearance-none focus:border-[#b76e79] focus:ring-0 text-[#7a5a57]"
            >
              {branchresponse.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          )}
          <FiChevronDown className="absolute right-3 top-4 text-[#9e6d70]" />
        </div>

        <div className="flex items-center gap-2 bg-[#fff0ee] p-3 rounded-xl flex-1 max-w-md border-2 border-[#e8c4c0]">
          <FiSearch className="text-[#9e6d70]" />
          <input
            type="text"
            placeholder="Search staff..."
            className="bg-transparent w-full focus:outline-none text-[#7a5a57] placeholder-[#9e6d70]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <AnimatedButton
          onClick={() => setIsAddStaffModalOpen(true)}
          variant="solid"
          gradient={["#b76e79", "#d8a5a5"]}
          hoverScale={1.05}
          tapScale={0.95}
          className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl w-40"
          icon={<FiPlus className="text-lg" />}
          iconPosition="left"
        >
          Add Staff
        </AnimatedButton>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#b76e79] h-26"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiUsers className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Staff</p>
              <p className="text-2xl font-bold text-[#7a5a57]">{totalStaff}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#d8a5a5] h-26"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiDollarSign className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                ${revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#9e6d70] h-26"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiBriefcase className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Total Salary</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
                ${totalsalary}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#7a5a57] h-26"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#fff0ee] rounded-xl">
              <FiUsers className="text-2xl text-[#b76e79]" />
            </div>
            <div>
              <p className="text-[#9e6d70]">Avg. Revenue/Staff</p>
              <p className="text-2xl font-bold text-[#7a5a57]">
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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e8c4c0]">
        <div className="p-6 border-b border-[#e8c4c0]">
          <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
            Staff Performance Overview
          </h2>
        </div>

        {filteredStaffs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fff0ee]">
                <tr>
                  {[
                    "Staff Member",
                    "Contact",
                    "Revenue Generated",
                    "Salary Received",
                    "Actions",
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
                {filteredStaffs.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-t border-[#e8c4c0] hover:bg-[#fff0ee] group transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={staff.profile_img || "/default-avatar.png"}
                          alt={staff.fullname}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#e8c4c0]"
                        />
                        <div>
                          <p className="font-medium text-[#7a5a57]">
                            {staff.fullname}
                          </p>
                          <p className="text-sm text-[#9e6d70]">
                            {staff.staff_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#7a5a57]">
                          {staff.contact}
                        </span>
                        <span className="text-sm text-[#9e6d70]">
                          {staff.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[#b76e79]">
                        ${getrevenuegenrated(staff.id).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[#b76e79]">
                        ${salaryrecieve(staff.id).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <AnimatedButton
                        onClick={() =>
                          router.push(`/${userId}/dashboard/staff/${staff.id}`)
                        }
                        variant="ghost"
                        className="text-[#7a5a57] hover:text-[#b76e79]"
                        hoverScale={1.1}
                        tapScale={0.95}
                      >
                        <FiSettings className="text-xl" />
                      </AnimatedButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-[#9e6d70]">
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
