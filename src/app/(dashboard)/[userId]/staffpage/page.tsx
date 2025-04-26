"use client";

import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiStar,
  FiDollarSign,
  FiUser,
  FiClock,
  FiScissors,
} from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { MdPendingActions } from "react-icons/md";

interface StaffData {
  fullname: string;
  profile_img: string;
  branch: {
    branch_name: string;
  };
  appointments: Appointement[];
  salaries: Salary[];
  feedbacks: Feedbacks[];
}

interface Salary {
  amount: number;
}

interface Appointement {
  name: string;
  client: {
    client_name: string;
  };
  service: {
    service_name: string;
    time: string;
  };
  time: string;
  status: string;
  date: string;
}

interface DecodedToken {
  userId: string;
}

interface Feedbacks {
  rating: number;
}

const StaffDashboard = () => {
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const staffToken = Cookies.get("staffToken");

      if (!staffToken) {
        setError("Staff not authenticated");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(staffToken);

        // Fetch staff data
        const staffResponse = await axios.get(
          `https://salon-backend-3.onrender.com/api/staff/get/${decoded.userId}`
        );

        // Fetch appointments

        setStaffData({
          fullname: staffResponse.data.fullname,
          profile_img: staffResponse.data.profile_img,
          branch: staffResponse.data.branch,
          appointments: staffResponse.data.appointments,
          salaries: staffResponse.data.salaries,
          feedbacks: staffResponse.data.feedbacks,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch dashboard information");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalearnings = (salaries: Salary[]) => {
    let earnings = 0;
    salaries.forEach((s) => {
      earnings += s.amount;
    });

    return earnings;
  };

  const avgfeedbacks = (feedbacks: Feedbacks[]) => {
    let avg = 0;
    feedbacks.forEach((f) => {
      avg += f.rating;
    });
    return feedbacks.length ? avg / feedbacks.length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 text-gray-600">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 text-red-500">{error}</div>
      </div>
    );
  }
  const StatusIndicator = ({ status }: { status: string }) => {
    const statusColors = {
      pending: "bg-amber-100 text-amber-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[status.toLowerCase() as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.toLowerCase() === "pending" && (
          <MdPendingActions className="mr-1.5" />
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTodayAppointments = () => {
    if (!staffData?.appointments?.length) return [];

    const now = new Date();
    const istOffset = 330 * 60000; // IST offset in milliseconds
    const istNow = new Date(now.getTime() + istOffset);

    // Calculate UTC boundaries for current IST day
    const todayStartIST = new Date(istNow);
    todayStartIST.setHours(0, 0, 0, 0);
    const todayStartUTC = new Date(todayStartIST.getTime() - istOffset);

    const todayEndIST = new Date(istNow);
    todayEndIST.setHours(23, 59, 59, 999);
    const todayEndUTC = new Date(todayEndIST.getTime() - istOffset);

    return staffData.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= todayStartUTC && appointmentDate <= todayEndUTC;
    });
  };

  const todayAppointments = getTodayAppointments();
  return (
    <div className="min-h-screen bg-gray-50 pb-8 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mt-12 border border-gray-200">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-purple-100">
              <img
                src={staffData?.profile_img || "/default-avatar.png"}
                className="w-full h-full object-cover"
                alt="Profile"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome, {staffData?.fullname}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                {staffData?.branch?.branch_name} Branch
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-purple-100">
                <FiCalendar className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">
                  Total Appointments
                </h3>
                <p className="text-3xl font-bold text-gray-800 tracking-tighter">
                  {staffData?.appointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-amber-100">
                <FiStar className="text-amber-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Average Rating</h3>
                <p className="text-3xl font-bold text-gray-800 tracking-tighter">
                  {staffData
                    ? avgfeedbacks(staffData.feedbacks)
                    : "Calculating...."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-green-100">
                <FiDollarSign className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Total Earnings</h3>
                <p className="text-3xl font-bold text-gray-800 tracking-tighter">
                  ₹{" "}
                  {staffData
                    ? totalearnings(staffData.salaries)
                    : "Calculating...."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mt-12 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-800">
              Today s Schedule
            </h3>
            <span className="text-gray-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          {todayAppointments?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 bg-gradient-to-b from-white to-[#faf7ff]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {appointment.client?.client_name || "Unknown Client"}
                      </h4>
                      <div className="flex items-center gap-3 text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <FiScissors className="w-4 h-4" />
                          <span className="text-sm">
                            {appointment.service?.service_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiClock className="w-4 h-4" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <StatusIndicator status={appointment.status} />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiUser className="w-4 h-4" />
                    <span>
                      Service Duration: {appointment.service?.time} mins
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg viewBox="0 0 100 100" className="text-purple-500">
                      <path
                        fill="currentColor"
                        d="M28.1,-36.4C34.3,-27.2,36.1,-16.4,38.5,-4.3C40.9,7.7,43.9,21.1,38.6,30.9C33.3,40.7,19.7,47,5.6,49.2C-8.5,51.4,-23.1,49.6,-35.4,43.2C-47.6,36.8,-57.5,25.9,-61.5,12.5C-65.4,-0.8,-63.4,-16.5,-55.9,-28.2C-48.5,-39.8,-35.6,-47.4,-21.9,-53.3C-8.1,-59.3,6.4,-63.5,18.1,-60.5C29.8,-57.5,38.7,-47.3,44.5,-36.1C50.3,-24.9,53,-12.7,53.6,0.3C54.1,13.3,52.5,26.6,46.5,36.6C40.5,46.5,30.1,53.1,18.3,57.9C6.5,62.7,-6.6,65.7,-18.9,63.5C-31.2,61.3,-42.7,53.9,-51.7,43.6C-60.7,33.3,-67.3,20.1,-68.9,6.2C-70.5,-7.7,-67.1,-22.3,-59.7,-34.3C-52.3,-46.3,-40.9,-55.7,-28.1,-61.7C-15.3,-67.6,-1.2,-70.2,11.7,-68.3C24.5,-66.3,49,-59.8,28.1,-36.4Z"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-gray-400">
                <FiCalendar className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h4 className="text-xl text-gray-500 font-medium">
                No appointments scheduled for today
              </h4>
              <p className="text-gray-400 mt-2">Enjoy your day! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
