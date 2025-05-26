"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import { useButtonLoader } from "@/context/buttonloader";
import { AnimatedButton } from "@/Components/ui/Button";

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
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [error, setError] = useState("");
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [salarydate, setsalarydate] = useState("");
  const [salaryamount, setsalaryamount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const paths = pathname.split("/");
  const { ButtonLoaderToggle, setButtonLoaderToggle } = useButtonLoader();
  const staffid = paths[paths.length - 1];

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setScreenLoaderToggle(true);
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
        setScreenLoaderToggle(false);
      }
    };

    fetchStaffData();
  }, [staffid]);

  const handleaddsalary = async () => {
    try {
      setButtonLoaderToggle(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/staff/addsallary`,
        {
          staff_id: staffid,
          amount: salaryamount,
          date: salarydate,
        }
      );

      if (response.data.salary) {
        setStaffData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            salary_history: [...prev.salary_history, response.data.salary],
          };
        });

        toast.success("Salary added successfully!");
        setShowAddSalary(false);
        setsalaryamount(0);
        setsalarydate("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Salary submission error:", err);

      let errorMessage = "Failed to add salary";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setButtonLoaderToggle(false);
    }
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
        borderColor: "#b76e79",
        tension: 0.4,
      },
    ],
  };

  if (ScreenLoaderToggle) {
    return <Screenloader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fff0ee] p-8 flex items-center justify-center">
        <div className="text-[#b76e79]">{error}</div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="min-h-screen bg-[#fff0ee] p-8 flex items-center justify-center">
        <div className="text-[#7a5a57]">Staff member not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <AnimatedButton
          onClick={() => router.back()}
          variant="ghost"
          gradient={["#b76e79", "#d8a5a5"]}
          className="mb-8 w-60"
          icon={<FiArrowLeft className="text-lg" />}
          iconPosition="left"
        >
          Back to Staff List
        </AnimatedButton>

        {/* Staff Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-[#e8c4c0]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <img
                src={staffData.profile_img || "/default-avatar.png"}
                alt={staffData.fullname}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#e8c4c0] mb-4"
              />
              <h2 className="text-2xl font-semibold text-[#7a5a57] font-dancing">
                {staffData.fullname}
              </h2>
              <p className="text-[#9e6d70]">{staffData.branch.name}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#fff0ee] rounded-xl">
                <p className="font-medium text-[#9e6d70]">Staff ID</p>
                <p className="text-[#7a5a57] font-medium">
                  {staffData.staff_id}
                </p>
              </div>
              <div className="p-4 bg-[#fff0ee] rounded-xl">
                <p className="font-medium text-[#9e6d70]">Contact</p>
                <p className="text-[#7a5a57] font-medium">
                  {staffData.contact}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#fff0ee] rounded-xl">
                <p className="font-medium text-[#9e6d70]">Email</p>
                <p className="text-[#7a5a57] font-medium">{staffData.email}</p>
              </div>
              <div className="p-4 bg-[#fff0ee] rounded-xl relative">
                <p className="font-medium text-[#9e6d70]">Password</p>
                <div className="flex justify-between items-center">
                  <p className="text-[#7a5a57] font-medium">
                    {showPassword ? staffData.password : "••••••••"}
                  </p>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#b76e79] hover:text-[#d8a5a5]"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-[#e8c4c0]">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#7a5a57]">
            <FiClock className="text-[#b76e79]" />
            Attendance History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fff0ee]">
                <tr>
                  <th className="p-4 text-left text-[#7a5a57]">Date</th>
                  <th className="p-4 text-left text-[#7a5a57]">Login Time</th>
                </tr>
              </thead>
              <tbody>
                {staffData.attendance_history.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[#e8c4c0] hover:bg-[#fff0ee]"
                  >
                    <td className="p-4 text-[#9e6d70]">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-[#7a5a57] font-medium">
                      {record.login_time}
                    </td>
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
                  title: {
                    display: true,
                    text: "Attendance Pattern",
                    color: "#7a5a57",
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Login Time (24h format)",
                      color: "#7a5a57",
                    },
                    min: 0,
                    max: 24,
                    ticks: { color: "#9e6d70" },
                  },
                  x: {
                    ticks: { color: "#9e6d70" },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Salary History */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-[#e8c4c0]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-[#7a5a57]">
              <FiDollarSign className="text-[#b76e79]" />
              Salary History
            </h3>
            <AnimatedButton
              onClick={() => setShowAddSalary(true)}
              variant="solid"
              gradient={["#b76e79", "#d8a5a5"]}
              icon={<FiPlus className="text-lg " />}
              iconPosition="left"
              className="w-55"
            >
              Add Salary
            </AnimatedButton>
          </div>

          {/* Add Salary Modal */}
          <AnimatePresence>
            {showAddSalary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e8c4c0]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#7a5a57]">
                      Add New Salary
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddSalary(false);
                        setsalaryamount(0);
                        setsalarydate("");
                      }}
                      className="text-[#9e6d70] hover:text-[#b76e79]"
                    >
                      <FiX className="text-2xl" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                        placeholder="Enter amount"
                        onChange={(e) => {
                          setsalaryamount(Number(e.target.value));
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#9e6d70]">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-3 border-2 border-[#e8c4c0] rounded-xl focus:border-[#b76e79] text-[#7a5a57]"
                        onChange={(e) => {
                          setsalarydate(e.target.value);
                        }}
                      />
                    </div>

                    <AnimatedButton
                      onClick={handleaddsalary}
                      isLoading={ButtonLoaderToggle}
                      variant="solid"
                      gradient={["#b76e79", "#d8a5a5"]}
                      className="w-full"
                    >
                      {ButtonLoaderToggle ? "Processing..." : "Add Salary"}
                    </AnimatedButton>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fff0ee]">
                <tr>
                  <th className="p-4 text-left text-[#7a5a57]">Payment Date</th>
                  <th className="p-4 text-left text-[#7a5a57]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {staffData.salary_history.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-[#e8c4c0] hover:bg-[#fff0ee]"
                  >
                    <td className="p-4 text-[#9e6d70]">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-[#7a5a57] font-medium">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e8c4c0]">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#7a5a57]">
            <FiScissors className="text-[#b76e79]" />
            Service History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fff0ee]">
                <tr>
                  <th className="p-4 text-left text-[#7a5a57]">Client</th>
                  <th className="p-4 text-left text-[#7a5a57]">Service</th>
                  <th className="p-4 text-left text-[#7a5a57]">Price</th>
                  <th className="p-4 text-left text-[#7a5a57]">Date</th>
                </tr>
              </thead>
              <tbody>
                {staffData.appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-[#e8c4c0] hover:bg-[#fff0ee]"
                  >
                    <td className="p-4 font-medium text-[#7a5a57]">
                      {appointment.client}
                    </td>
                    <td className="p-4 text-[#9e6d70]">
                      {appointment.service}
                    </td>
                    <td className="p-4 text-[#7a5a57] font-medium">
                      ₹{appointment.service_price}
                    </td>
                    <td className="p-4 text-[#9e6d70]">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StaffDetailsPage;
