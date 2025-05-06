'use client';
import { useState } from 'react';
import {
  FiUser,
  FiEdit,
  FiSearch,
  FiMessageSquare,
  FiAward,
  FiCalendar,
  FiDollarSign,
  FiX,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Feedback {
  date: string;
  message: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  planType: string;
  joinDate: string;
  renewals: number;
  loyaltyPoints: number;
  feedbacks: Feedback[];
}

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'profile' | 'feedback' | 'loyalty'>('profile');

  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      plan: 'Premium',
      planType: 'Monthly',
      joinDate: '2023-01-15',
      renewals: 5,
      loyaltyPoints: 1200,
      feedbacks: [
        { date: '2023-03-15', message: 'Excellent service quality!' },
        { date: '2023-06-01', message: 'Loved the new features added' },
      ],
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      plan: 'Standard',
      planType: 'Yearly',
      joinDate: '2023-03-10',
      renewals: 2,
      loyaltyPoints: 800,
      feedbacks: [{ date: '2023-05-20', message: 'Good value for money' }],
    },
    {
      id: 3,
      name: 'Rohan Singh',
      email: 'rohan@example.com',
      phone: '+91 98765 43212',
      plan: 'Basic',
      planType: 'Monthly',
      joinDate: '2023-06-01',
      renewals: 3,
      loyaltyPoints: 600,
      feedbacks: [],
    },
  ]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const calculateLoyaltyPoints = (customer: Customer) => {
    const daysEnrolled = Math.floor(
      (new Date().getTime() - new Date(customer.joinDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const basePoints = daysEnrolled * 2;
    const renewalPoints = customer.renewals * 100;
    return basePoints + renewalPoints;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Customer Management
        </h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {customer.plan} Plan
                </span>
                <FiAward className="text-green-500" />
                <span className="text-sm text-gray-600">
                  {calculateLoyaltyPoints(customer)} Points
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-400/30 backdrop-blur-md flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCustomer.name}
                </h2>
                <p className="text-gray-500">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="flex gap-4 border-b mb-6">
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-purple-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'feedback'
                    ? 'border-b-2 border-purple-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('feedback')}
              >
                Feedback ({selectedCustomer.feedbacks.length})
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === 'loyalty'
                    ? 'border-b-2 border-purple-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('loyalty')}
              >
                Loyalty Points
              </button>
            </div>

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <FiCalendar />
                      <span>Plan Type</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {selectedCustomer.plan} ({selectedCustomer.planType})
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <FiDollarSign />
                      <span>Renewals</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {selectedCustomer.renewals} Successful Renewals
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 border rounded-lg">
                      <p className="font-medium">Phone Number</p>
                      <p className="text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                    <div className="flex-1 p-4 border rounded-lg">
                      <p className="font-medium">Join Date</p>
                      <p className="text-gray-600">
                        {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {selectedCustomer.feedbacks.length > 0 ? (
                  selectedCustomer.feedbacks.map((feedback, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-600">{feedback.message}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No feedback available
                  </div>
                )}
              </div>
            )}

            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateLoyaltyPoints(selectedCustomer)} Points
                      </div>
                      <div className="text-gray-600">Total Earned Points</div>
                    </div>
                    <FiAward className="text-4xl text-purple-600" />
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: 'Jan', points: 200 },
                          { month: 'Feb', points: 350 },
                          { month: 'Mar', points: 500 },
                        ]}
                      >
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="points" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Points Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Points (Daily Enrollment)</span>
                      <span>
                        {(
                          Math.floor(
                            (new Date().getTime() -
                              new Date(selectedCustomer.joinDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) * 2
                        ).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewal Bonus Points</span>
                      <span>{selectedCustomer.renewals * 100}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
