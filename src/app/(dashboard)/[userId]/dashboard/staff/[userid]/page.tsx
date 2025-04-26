"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiClock,
  FiDollarSign,
  FiScissors,
  FiArrowLeft,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StaffData {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  profile_img?: string;
  staff_id: string;
  password: string;
  branch: {
    id: string;
    name: string;
    location: string;
  };
  user: {
    id: string;
    name: string;
  };
  salary_history: Array<{
    id: string;
    amount: number;
    date: string;
  }>;
  attendance_history: Array<{
    id: string;
    date: string;
    login_time: string;
  }>;
  appointments: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
    service: string;
    service_price: number;
    client: string;
  }>;
  clients: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

const StaffDetailsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [salarydate, setsalarydate] = useState("");
  const [salaryamount, setsalaryamount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const paths = pathname.split("/");
  const staffid = paths[paths.length - 1];

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/getstaff/${staffid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }

        const data = await response.json();
        setStaffData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [staffid]);

  const handleaddsalary = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/addsallary`,
      {
        staff_id: staffid,
        amount: salaryamount,
        date: salarydate,
      }
    );
    if (response.data.salary) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    setShowAddSalary(false);
  };

  // Chart data calculation
  const chartData = {
    labels:
      staffData?.attendance_history.map((a) =>
        new Date(a.date).toLocaleDateString()
      ) || [],
    datasets: [
      {
        label: "Daily Login Time",
        data:
          staffData?.attendance_history.map((a) => {
            const [time, period] = a.login_time.split(" ");
            const hours =
              parseInt(time.split(":")[0]) + (period === "PM" ? 12 : 0);
            return hours;
          }) || [],
        borderColor: "#7C3AED",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div>Staff member not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mb-8 flex items-center gap-2 text-purple-600"
          onClick={() => router.back()}
        >
          <FiArrowLeft />
          Back to Staff List
        </motion.button>

        {/* Staff Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <img
                src={staffData.profile_img || "/default-avatar.png"}
                alt={staffData.fullname}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 mb-4"
              />
              <h2 className="text-2xl font-semibold">{staffData.fullname}</h2>
              <p className="text-gray-500">{staffData.branch.name}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Staff ID</p>
                <p className="text-gray-600">{staffData.staff_id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Contact</p>
                <p className="text-gray-600">{staffData.contact}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{staffData.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg relative">
                <p className="font-medium">Password</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    {showPassword ? staffData.password : "••••••••"}
                  </p>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-purple-600" />
            Attendance History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Login Time</th>
                </tr>
              </thead>
              <tbody>
                {staffData.attendance_history.map((record) => (
                  <tr key={record.id} className="border-t border-gray-100">
                    <td className="p-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{record.login_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 h-64">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Attendance Pattern" },
                },
                scales: {
                  y: {
                    title: { display: true, text: "Login Time (24h format)" },
                    min: 0,
                    max: 24,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Salary History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiDollarSign className="text-purple-600" />
              Salary History
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setShowAddSalary(true)}
            >
              <FiPlus className="text-lg" />
              Add Salary
            </motion.button>
          </div>

          {/* Add Salary Modal */}
          {showAddSalary && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Add New Salary</h3>
                  <button
                    onClick={() => {
                      setShowAddSalary(false);
                      setsalaryamount(0);
                      setsalarydate("");
                    }}
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter amount"
                      onChange={(e) => {
                        setsalaryamount(Number(e.target.value));
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      onChange={(e) => {
                        setsalarydate(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    onClick={handleaddsalary}
                  >
                    Add Salary
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Payment Date</th>
                  <th className="p-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {staffData.salary_history.map((payment) => (
                  <tr key={payment.id} className="border-t border-gray-100">
                    <td className="p-3">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">${payment.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiScissors className="text-purple-600" />
            Service History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {staffData.appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t border-gray-100">
                    <td className="p-3 font-medium">{appointment.client}</td>
                    <td className="p-3">{appointment.service}</td>
                    <td className="p-3">${appointment.service_price}</td>
                    <td className="p-3">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsPage;
