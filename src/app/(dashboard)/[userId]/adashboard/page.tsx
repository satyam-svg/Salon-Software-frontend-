"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiCalendar, FiDollarSign, FiUserPlus, FiBriefcase, FiTrendingUp, FiUsers } from 'react-icons/fi';

const OverviewPage = () => {
  const [stats, setStats] = useState({
    appointments: { today: 12, week: 68, month: 240 },
    revenue: { today: 125000, week: 680000, month: 2400000 },
    clients: { new: 23, growth: 15 },
    staff: [
      { name: 'Sarah', clients: 18, revenue: 420000 },
      { name: 'Mike', clients: 12, revenue: 320000 },
      { name: 'Emma', clients: 15, revenue: 380000 },
    ]
  });

  const appointmentData = [
    { day: 'Mon', appointments: 12 },
    { day: 'Tue', appointments: 18 },
    { day: 'Wed', appointments: 15 },
    { day: 'Thu', appointments: 22 },
    { day: 'Fri', appointments: 19 },
    { day: 'Sat', appointments: 24 },
    { day: 'Sun', appointments: 14 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 65 },
    { month: 'Feb', revenue: 78 },
    { month: 'Mar', revenue: 92 },
    { month: 'Apr', revenue: 81 },
    { month: 'May', revenue: 89 },
    { month: 'Jun', revenue: 96 },
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Appointments Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="text-lg" />
                <h3 className="font-medium">Appointments</h3>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Today</span>
                  <span className="font-medium text-lg">{stats.appointments.today}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Week</span>
                  <span className="font-medium text-lg">{stats.appointments.week}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Month</span>
                  <span className="font-medium text-lg">{stats.appointments.month}</span>
                </div>
              </div>
            </div>
            <div className="h-20 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentData}>
                  <Line type="monotone" dataKey="appointments" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

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
                  <span className="font-medium text-lg">₹{stats.revenue.today.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Week</span>
                  <span className="font-medium text-lg">₹{stats.revenue.week.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Month</span>
                  <span className="font-medium text-lg">₹{stats.revenue.month.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="h-20 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">+{stats.clients.new}</div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FiTrendingUp className="text-lg" />
                  {stats.clients.growth}% vs last month
                </div>
              </div>
            </div>
            <div className="h-20 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <Bar dataKey="appointments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                {stats.staff.map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-gray-500" />
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{member.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{member.clients} clients</div>
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
          <h3 className="text-lg font-medium mb-4 text-gray-700">Revenue Overview</h3>
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
          <h3 className="text-lg font-medium mb-4 text-gray-700">Revenue Distribution by Staff</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.staff}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.staff.map((_, index) => (
                    <Cell key={index} fill={['#4f46e5', '#10b981', '#8b5cf6'][index]} />
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