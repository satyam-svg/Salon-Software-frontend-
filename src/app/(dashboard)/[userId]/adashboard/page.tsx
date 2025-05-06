"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiDollarSign, FiUserPlus, FiBriefcase, FiUsers } from "react-icons/fi";
import axios from "axios";
interface staff {
    name: string;
    clientsAdded: number;
    totalRevenue: number;
}
interface revenueData {
  month: string;
  revenue:number;
}
const OverviewPage = () => {
  const [staff , setstaff] = useState<staff[]>([]);
  const [revenueData , setrevenueData] = useState<revenueData[]>([]);



  const [dailyusercount, setdailyusercount] = useState(0);
  const [weeklyusercount, setweeklyusercount] = useState(0);
  const [monthusercount, setmonthusercount] = useState(0);
  const [dailyuserrevenue, setdailyuserrevenue] = useState(0);
  const [weeklyuserrevenue, setweeklyuserrevenue] = useState(0);
  const [monthuserrevenue, setmonthuserrevenue] = useState(0);
  
  useEffect(() => {
    const getuserbyperiod = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/getalluser`
      );

      setdailyusercount(response.data.daily.count);
      setweeklyusercount(response.data.weekly.count);
      setmonthusercount(response.data.monthly.count);
    };

    const getrevenue = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/purchasedplan/getreveneue`
      );

      setdailyuserrevenue(response.data.data.daily_revenue);
      setweeklyuserrevenue(response.data.data.weekly_revenue);
      setmonthuserrevenue(response.data.data.monthly_revenue);
    };
    const gettopsallers = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/purchasedplan/gettopseller`
      );
      setstaff(response.data.data);
    };
    const getrevenuedata = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/purchasedplan/revenuedata`
      );
      setrevenueData(response.data.data);
    };
    getuserbyperiod();
    getrevenue();
    gettopsallers();
    getrevenuedata();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FiDollarSign className="text-lg" />
                <h3 className="font-medium">Revenue</h3>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Today</span>
                  <span className="font-medium text-lg">
                    ₹{dailyuserrevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Week</span>
                  <span className="font-medium text-lg">
                    ₹{weeklyuserrevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Month</span>
                  <span className="font-medium text-lg">
                    ₹{monthuserrevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Clients Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUserPlus className="text-lg" />
                <h3 className="font-medium">New Clients</h3>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Today</span>
                  <span className="font-medium text-lg">
                    {dailyusercount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Week</span>
                  <span className="font-medium text-lg">
                    {weeklyusercount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Month</span>
                  <span className="font-medium text-lg">
                    {monthusercount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Performance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FiBriefcase className="text-lg" />
                <h3 className="font-medium">Staff Performance</h3>
              </div>
              <div className="space-y-3">
                {staff.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-gray-500" />
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹{member.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.clientsAdded} clients
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Revenue Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Revenue Distribution by Staff
          </h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={staff}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {staff.map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#4f46e5", "#10b981", "#8b5cf6"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
