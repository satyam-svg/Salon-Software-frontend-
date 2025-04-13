'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiBriefcase, FiChevronDown, FiSearch, FiSettings } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { usePathname } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Staff {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  revenue: number;
  services: number;
  branch: string;
  image: string;
}

const StaffManagementPage = () => {
  const [branches] = useState(['Downtown Branch', 'Uptown Branch', 'Westside Branch', 'Eastside Branch']);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy Staff Data
  const [staffs] = useState<Staff[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      position: 'Senior Stylist',
      contact: 'emma@salon.com | (555) 123-4567',
      salary: 4500,
      revenue: 18200,
      services: 142,
      branch: 'Downtown Branch',
      image: 'https://media.istockphoto.com/id/1949501832/photo/handsome-hispanic-senior-business-man-with-crossed-arms-smiling-at-camera-indian-or-latin.jpg?s=1024x1024&w=is&k=20&c=r7kQcwLCz2LvMZlHZlssIvHLhAgllsh-tRlw4tYdpjc='
    },
    {
      id: '2',
      name: 'James Brown',
      position: 'Color Specialist',
      contact: 'james@salon.com | (555) 234-5678',
      salary: 3800,
      revenue: 15600,
      services: 112,
      branch: 'Downtown Branch',
      image: 'https://media.istockphoto.com/id/1949501832/photo/handsome-hispanic-senior-business-man-with-crossed-arms-smiling-at-camera-indian-or-latin.jpg?s=1024x1024&w=is&k=20&c=r7kQcwLCz2LvMZlHZlssIvHLhAgllsh-tRlw4tYdpjc='
    },
    {
      id: '3',
      name: 'Sophia Miller',
      position: 'Spa Therapist',
      contact: 'sophia@salon.com | (555) 345-6789',
      salary: 3200,
      revenue: 13400,
      services: 98,
      branch: 'Uptown Branch',
      image: 'https://media.istockphoto.com/id/1949501832/photo/handsome-hispanic-senior-business-man-with-crossed-arms-smiling-at-camera-indian-or-latin.jpg?s=1024x1024&w=is&k=20&c=r7kQcwLCz2LvMZlHZlssIvHLhAgllsh-tRlw4tYdpjc='
    }
  ]);

  // Filtered Staff
  const filteredStaffs = staffs.filter(staff => 
    staff.branch === selectedBranch &&
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics Calculations
  const totalStaff = filteredStaffs.length;
  const totalRevenue = filteredStaffs.reduce((sum, staff) => sum + staff.revenue, 0);
  const totalSalary = filteredStaffs.reduce((sum, staff) => sum + staff.salary, 0);
  const avgRevenuePerStaff = totalRevenue / totalStaff;
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  // Performance Chart Data
  const chartData = {
    labels: filteredStaffs.map(staff => staff.name),
    datasets: [{
      label: 'Revenue Generated',
      data: filteredStaffs.map(staff => staff.revenue),
      backgroundColor: '#7C3AED',
      borderRadius: 8
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">${totalSalary.toLocaleString()}</p>
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
              <p className="text-2xl font-bold">${avgRevenuePerStaff.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
                <th className="p-4 text-left">Salary</th>
                <th className="p-4 text-left">Services Completed</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map(staff => (
                <tr 
                  key={staff.id} 
                  className="border-t border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={staff.image} 
                        alt={staff.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                      />
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm">{staff.contact.split(' | ')[0]}</span>
                      <span className="text-sm text-gray-500">{staff.contact.split(' | ')[1]}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-green-600">
                      ${staff.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-red-600">
                      ${staff.salary.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{staff.services}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500" 
                          style={{ width: `${(staff.services / 200) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => window.location.href = `/${userId}/dashboard/staff/${staff.id}`}
                    >
                      <FiSettings className="text-xl" />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Revenue Distribution</h2>
        <div className="h-96">
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                y: { 
                  beginAtZero: true,
                  grid: { color: '#f3f4f6' },
                  ticks: { callback: value => `$${value}` }
                },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffManagementPage;