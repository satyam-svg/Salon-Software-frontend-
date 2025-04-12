'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiEdit, FiTrash, FiPlus, FiChevronDown, FiClock, FiDollarSign, FiActivity, FiList } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Service {
  id: string;
  name: string;
  branch: string;
  time: number; // in minutes
  charge: number;
  monthlyUsage: number;
}

const ServiceManagementPage = () => {
  const [branches] = useState(['Downtown Branch', 'Uptown Branch', 'Westside Branch', 'Eastside Branch']);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Dummy Services Data
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Premium Haircut',
      branch: 'Downtown Branch',
      time: 45,
      charge: 65.00,
      monthlyUsage: 142
    },
    {
      id: '2',
      name: 'Color Treatment',
      branch: 'Downtown Branch',
      time: 120,
      charge: 120.00,
      monthlyUsage: 89
    },
    {
      id: '3',
      name: 'Deep Conditioning',
      branch: 'Uptown Branch',
      time: 30,
      charge: 45.00,
      monthlyUsage: 112
    },
    {
      id: '4',
      name: 'Beard Trim',
      branch: 'Westside Branch',
      time: 20,
      charge: 25.00,
      monthlyUsage: 156
    }
  ]);

  // Chart Data
  const chartData = {
    labels: services.filter(s => s.branch === selectedBranch).map(s => s.name),
    datasets: [
      {
        label: 'Monthly Usage',
        data: services.filter(s => s.branch === selectedBranch).map(s => s.monthlyUsage),
        backgroundColor: '#7C3AED',
        borderRadius: 8
      }
    ]
  };

  // Filtered Services
  const filteredServices = services.filter(service => service.branch === selectedBranch);

  // Statistics Calculations
  const totalServices = filteredServices.length;
  const averageTime = filteredServices.reduce((sum, service) => sum + service.time, 0) / totalServices;
  const monthlyRevenue = filteredServices.reduce((sum, service) => sum + (service.charge * service.monthlyUsage), 0);
  const monthlyBookings = filteredServices.reduce((sum, service) => sum + service.monthlyUsage, 0);

  // Form Handling
  const [formData, setFormData] = useState({
    name: '',
    time: 0,
    charge: 0
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      time: service.time,
      charge: service.charge
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? { ...editingService, ...formData } : s
      ));
    } else {
      setServices([...services, {
        ...formData,
        id: Math.random().toString(),
        branch: selectedBranch,
        monthlyUsage: 0
      }]);
    }
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', time: 0, charge: 0 });
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl appearance-none focus:border-purple-500 focus:ring-0"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiPlus className="text-lg" />
            Add Service
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiList className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-xl font-bold">{totalServices}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Time</p>
              <p className="text-xl font-bold">{averageTime.toFixed(0)} min</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-xl font-bold">${monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FiActivity className="text-xl text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Bookings</p>
              <p className="text-xl font-bold">{monthlyBookings}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Service List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Service Name</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Charge</th>
                <th className="p-4 text-left">Monthly Usage</th>
                <th className="p-4 text-left">Popularity</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr 
                  key={service.id} 
                  className="border-t border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-4 font-medium">{service.name}</td>
                  <td className="p-4">{service.time} min</td>
                  <td className="p-4">${service.charge.toFixed(2)}</td>
                  <td className="p-4">{service.monthlyUsage}</td>
                  <td className="p-4 w-48">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300" 
                        style={{ width: `${(service.monthlyUsage / Math.max(...services.map(s => s.monthlyUsage))) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => handleEdit(service)}
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setShowDeleteConfirm(service.id)}
                    >
                      <FiTrash />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Service Performance Overview</h2>
        <div className="h-96">
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Monthly Service Usage' }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">
                {editingService ? 'Edit Service' : 'New Service'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Name</label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: +e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Service Charge</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.charge}
                      onChange={(e) => setFormData({ ...formData, charge: +e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl"
                >
                  {editingService ? 'Update' : 'Create'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setFormData({ name: '', time: 0, charge: 0 });
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteService(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceManagementPage;