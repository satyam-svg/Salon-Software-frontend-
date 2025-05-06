"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiEdit,
  FiSearch,
  FiMessageSquare,
  FiAward,
  FiCalendar,
  FiDollarSign,
  FiX,
  FiLoader,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  created_at: string;
  salon: string;
}

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "profile" | "feedback" | "loyalty"
  >("profile");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
      plan: "Premium",
      planType: "Monthly",
      joinDate: "2023-01-15",
      renewals: 5,
      loyaltyPoints: 1200,
      feedbacks: [
        { date: "2023-03-15", message: "Excellent service quality!" },
        { date: "2023-06-01", message: "Loved the new features added" },
      ],
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      plan: "Standard",
      planType: "Yearly",
      joinDate: "2023-03-10",
      renewals: 2,
      loyaltyPoints: 800,
      feedbacks: [{ date: "2023-05-20", message: "Good value for money" }],
    },
    {
      id: 3,
      name: "Rohan Singh",
      email: "rohan@example.com",
      phone: "+91 98765 43212",
      plan: "Basic",
      planType: "Monthly",
      joinDate: "2023-06-01",
      renewals: 3,
      loyaltyPoints: 600,
      feedbacks: [],
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  useEffect(() => {
    const getcontactinfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/getallusercontactinfo`
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getcontactinfo();
  }, []);

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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FiLoader className="animate-spin text-4xl text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {user.salon || "No Salon"}
                  </span>
                  <FiAward className="text-green-500" />
                  <span className="text-sm text-gray-600">
                    {calculateLoyaltyPoints(user)} Points
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-400/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedUser.name}
                </h2>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="flex gap-4 border-b mb-6">
              <button
                className={`pb-2 px-4 ${
                  activeTab === "profile"
                    ? "border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === "feedback"
                    ? "border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("feedback")}
              >
                Feedback 0
              </button>
              <button
                className={`pb-2 px-4 ${
                  activeTab === "loyalty"
                    ? "border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("loyalty")}
              >
                Loyalty Points
              </button>
            </div>

            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <FiCalendar />
                      <span>Plan Type</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {/* {selectedCustomer.plan} ({selectedCustomer.planType}) */}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <FiDollarSign />
                      <span>Renewals</span>
                    </div>
                    <div className="text-xl font-semibold">
                      0 Successful Renewals
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 border rounded-lg">
                      <p className="font-medium">Phone Number</p>
                      <p className="text-gray-600">{selectedUser.phone}</p>
                    </div>
                    <div className="flex-1 p-4 border rounded-lg">
                      <p className="font-medium">Join Date</p>
                      <p className="text-gray-600">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-4">
                {selectedUser.feedbacks.length > 0 ? (
                  selectedUser.feedbacks.map((feedback, index) => (
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

            {activeTab === "loyalty" && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateLoyaltyPoints(selectedUser)} Points
                      </div>
                      <div className="text-gray-600">Total Earned Points</div>
                    </div>
                    <FiAward className="text-4xl text-purple-600" />
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", points: 200 },
                          { month: "Feb", points: 350 },
                          { month: "Mar", points: 500 },
                        ]}
                      >
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="points"
                          fill="#4f46e5"
                          radius={[4, 4, 0, 0]}
                        />
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
                              new Date(selectedUser.created_at).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) * 2
                        ).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewal Bonus Points</span>
                      <span>{selectedUser.renewals * 100}</span>
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
