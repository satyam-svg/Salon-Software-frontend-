'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiStar, FiUser, FiMail, FiPhone, FiEdit, FiTrash, FiCheckSquare, FiFilter, FiChevronDown } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Feedback {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  date: string;
  rating: number;
  review: string;
  service: string;
  staffName: string;
  featured: boolean;
  branch: string;
}

const FeedbackManagementPage = () => {
  const [branches] = useState(['Downtown Branch', 'Uptown Branch', 'Westside Branch', 'Eastside Branch']);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  // Dummy Feedback Data
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@example.com',
      date: '2024-03-15',
      rating: 5,
      review: 'Exceptional service! The staff was incredibly professional.',
      service: 'Premium Haircut',
      staffName: 'Emma Wilson',
      featured: true,
      branch: 'Downtown Branch'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      phone: '(555) 234-5678',
      email: 'michael@example.com',
      date: '2024-03-14',
      rating: 4,
      review: 'Good experience, but waited a bit longer than expected.',
      service: 'Color Treatment',
      staffName: 'James Brown',
      featured: false,
      branch: 'Downtown Branch'
    },
    {
      id: '3',
      clientName: 'Olivia Davis',
      phone: '(555) 345-6789',
      email: 'olivia@example.com',
      date: '2024-03-13',
      rating: 5,
      review: 'Best salon experience ever! Highly recommended.',
      service: 'Spa Treatment',
      staffName: 'Sophia Miller',
      featured: true,
      branch: 'Uptown Branch'
    }
  ]);

  // Filtered Feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.branch === selectedBranch &&
    feedback.rating >= minRating &&
    (selectedDate ? feedback.date === selectedDate : true)
  );

  // Statistics Calculations
  const totalFeedbacks = filteredFeedbacks.length;
  const averageRating = filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks;
  const featuredCount = filteredFeedbacks.filter(f => f.featured).length;

  // Rating Distribution Data
  const ratingDistribution = [0, 0, 0, 0, 0];
  filteredFeedbacks.forEach(f => ratingDistribution[f.rating - 1]++);

  // Chart Data
  const chartData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      label: 'Rating Distribution',
      data: ratingDistribution,
      backgroundColor: '#7C3AED',
      borderRadius: 8
    }]
  };

  // Form Handling
  const [formData, setFormData] = useState({
    rating: 5,
    featured: false,
    review: ''
  });

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      rating: feedback.rating,
      featured: feedback.featured,
      review: feedback.review
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingFeedback) {
      setFeedbacks(feedbacks.map(f => 
        f.id === editingFeedback.id ? { ...editingFeedback, ...formData } : f
      ));
    }
    setShowModal(false);
    setEditingFeedback(null);
  };

  const toggleFeatured = (id: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, featured: !f.featured } : f
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white text-gray-600 px-6 py-3 rounded-xl border-2 border-gray-200"
        >
          <FiFilter className="text-lg" />
          Filter Feedbacks
        </motion.button>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num === 0 ? 'All Ratings' : `${num}+ Stars`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiStar className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUser className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Feedbacks</p>
              <p className="text-2xl font-bold">{totalFeedbacks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckSquare className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Featured Feedbacks</p>
              <p className="text-2xl font-bold">{featuredCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold">Client Feedback</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Review</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Staff</th>
                <th className="p-4 text-left">Featured</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map(feedback => (
                <tr 
                  key={feedback.id} 
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{feedback.clientName}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <FiPhone className="text-gray-500" />
                        <span>{feedback.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMail className="text-gray-500" />
                        <span>{feedback.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {new Date(feedback.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < feedback.rating ? 'fill-current' : ''}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="line-clamp-2">{feedback.review}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {feedback.service}
                    </span>
                  </td>
                  <td className="p-4">{feedback.staffName}</td>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={feedback.featured}
                      onChange={() => toggleFeatured(feedback.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </td>
                  <td className="p-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => handleEdit(feedback)}
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-red-600 hover:text-red-700"
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

      {/* Rating Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Rating Distribution</h2>
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
                y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </div>

      {/* Edit Feedback Modal */}
      <AnimatePresence>
        {showModal && editingFeedback && (
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
              <h3 className="text-2xl font-semibold mb-6">Edit Feedback</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <FiStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Review</label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 h-32"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm font-medium">Feature on Homepage</label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl"
                >
                  Update Feedback
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowModal(false)}
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

export default FeedbackManagementPage;