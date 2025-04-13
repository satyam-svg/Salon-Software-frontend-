'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiClock, FiDollarSign, FiScissors, FiArrowLeft, FiStar } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StaffDetailsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [staff] = useState({
    id: 'STF-001',
    name: 'Emma Wilson',
    position: 'Senior Stylist',
    contact: '+1 555 123 4567',
    email: 'emma@salon.com',
    password: 'salon@123',
    image: 'https://media.istockphoto.com/id/1949501832/photo/handsome-hispanic-senior-business-man-with-crossed-arms-smiling-at-camera-indian-or-latin.jpg?s=1024x1024&w=is&k=20&c=r7kQcwLCz2LvMZlHZlssIvHLhAgllsh-tRlw4tYdpjc=',
  });

  // Dummy Data
  const attendanceHistory = [
    { date: '2024-03-15', login: '09:00 AM', logout: '06:30 PM' },
    { date: '2024-03-14', login: '09:15 AM', logout: '07:00 PM' },
    { date: '2024-03-13', login: '08:45 AM', logout: '06:45 PM' },
  ];

  const salaryHistory = [
    { date: '2024-03-01', amount: 4500, method: 'Bank Transfer' },
    { date: '2024-02-01', amount: 4500, method: 'Bank Transfer' },
    { date: '2024-01-01', amount: 4500, method: 'Bank Transfer' },
  ];

  const serviceHistory = [
    { client: 'Sarah Johnson', service: 'Premium Haircut', rating: 5, price: 65, date: '2024-03-15' },
    { client: 'Michael Chen', service: 'Color Treatment', rating: 4, price: 120, date: '2024-03-14' },
    { client: 'Olivia Davis', service: 'Spa Treatment', rating: 5, price: 85, date: '2024-03-13' },
  ];

  // Attendance Chart Data
  const chartData = {
    labels: attendanceHistory.map(a => new Date(a.date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Login Time',
      data: attendanceHistory.map(a => {
        const [time, period] = a.login.split(' ');
        const hours = parseInt(time.split(':')[0]) + (period === 'PM' ? 12 : 0);
        return hours;
      }),
      borderColor: '#7C3AED',
      tension: 0.4,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mb-8 flex items-center gap-2 text-purple-600"
          onClick={() => window.history.back()}
        >
          <FiArrowLeft />
          Back to Staff List
        </motion.button>

        {/* Staff Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <img 
                src={staff.image} 
                alt={staff.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 mb-4"
              />
              <h2 className="text-2xl font-semibold">{staff.name}</h2>
              <p className="text-gray-500">{staff.position}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Staff ID</p>
                <p className="text-gray-600">{staff.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Contact</p>
                <p className="text-gray-600">{staff.contact}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{staff.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg relative">
                <p className="font-medium">Password</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    {showPassword ? staff.password : '••••••••'}
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
                  <th className="p-3 text-left">Logout Time</th>
                  <th className="p-3 text-left">Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="p-3">{record.login}</td>
                    <td className="p-3">{record.logout}</td>
                    <td className="p-3">9.5 hours</td>
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
                  legend: { position: 'top' },
                  title: { display: true, text: 'Attendance Pattern' }
                },
                scales: {
                  y: { 
                    title: { display: true, text: 'Login Time (24h format)' },
                    min: 0,
                    max: 24
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Salary History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-purple-600" />
            Salary History
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Payment Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Payment Method</th>
                  <th className="p-3 text-left">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {salaryHistory.map((payment, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-3">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="p-3">${payment.amount.toLocaleString()}</td>
                    <td className="p-3">{payment.method}</td>
                    <td className="p-3 text-gray-500">TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</td>
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
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistory.map((service, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-3 font-medium">{service.client}</td>
                    <td className="p-3">{service.service}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < service.rating ? 'fill-current' : ''} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({service.rating}/5)</span>
                      </div>
                    </td>
                    <td className="p-3">${service.price}</td>
                    <td className="p-3">{new Date(service.date).toLocaleDateString()}</td>
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