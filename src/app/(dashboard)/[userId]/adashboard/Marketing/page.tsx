"use client";
import { useState } from "react";
import {
  FiMail,
  FiGift,
  FiUsers,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function MarketingCampaigns() {
  const [activeTab, setActiveTab] = useState(0);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Dummy Data
  const campaigns = [
    {
      id: 1,
      type: "email",
      subject: "Summer Sale - 50% Off!",
      audience: "All Customers",
      status: "sent",
      date: "2024-04-15",
    },
    {
      id: 2,
      type: "birthday",
      subject: "Happy Birthday Special Offer!",
      audience: "Birthday Customers",
      status: "draft",
      date: "2024-04-16",
    },
    {
      id: 3,
      type: "sms",
      subject: "Flash Sale Alert!",
      audience: "Premium Members",
      status: "scheduled",
      date: "2024-04-17",
    },
  ];

  const referrals = [
    {
      id: 1,
      referrer: "Emma Wilson",
      referred: "mike@example.com",
      date: "2024-03-15",
      reward: "pending",
    },
    {
      id: 2,
      referrer: "John Carter",
      referred: "sarah@example.com",
      date: "2024-04-01",
      reward: "paid",
    },
    {
      id: 3,
      referrer: "Sophia Kim",
      referred: "david@example.com",
      date: "2024-04-10",
      reward: "eligible",
    },
  ];

  const customers = [
    {
      id: 1,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 234 567 890",
      birthday: "1990-04-20",
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah@example.com",
      phone: "+1 345 678 901",
      birthday: "1992-08-15",
    },
  ];

  const CampaignModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FiPlus /> Create New Campaign
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Type
            </label>
            <select className="w-full p-2 border rounded-lg">
              <option>Email Campaign</option>
              <option>SMS Campaign</option>
              <option>Birthday Wishes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Subject/Title
            </label>
            <input type="text" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audience</label>
            <select className="w-full p-2 border rounded-lg">
              <option>All Customers</option>
              <option>Premium Members</option>
              <option>Recent Customers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Message Content
            </label>
            <textarea rows={4} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowCampaignModal(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Schedule Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiMail className="text-blue-500" /> Marketing Campaigns
          </h1>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiPlus /> Create Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiMail className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">1,234</h3>
                <p className="text-gray-500">Total Campaigns</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiGift className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">892</h3>
                <p className="text-gray-500">Birthday Wishes Sent</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">$12,450</h3>
                <p className="text-gray-500">Referral Rewards Paid</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex gap-4 border-b border-gray-200 mb-6">
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 0
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <FiMail className="inline mr-2" /> Email Campaigns
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 1
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <FiUsers className="inline mr-2" /> Referral Program
            </Tab>
            <Tab
              className={`py-2 px-4 cursor-pointer ${
                activeTab === 2
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <FiGift className="inline mr-2" /> SMS Campaigns
            </Tab>
          </TabList>

          {/* Email Campaigns Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Audience
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        {campaign.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                          {campaign.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{campaign.audience}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            campaign.status === "sent"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-500">
                          <FiEdit />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500">
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Referral Program Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiUsers className="text-blue-500" /> Referral Program
                  Management
                </h2>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FiPlus /> Add Referral
                </button>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    $2,340
                  </div>
                  <div className="text-sm text-gray-600">Rewards Given</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Pending Rewards</div>
                </div>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Referred Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Reward Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">
                        {referral.referrer}
                      </td>
                      <td className="px-6 py-4">{referral.referred}</td>
                      <td className="px-6 py-4">{referral.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            referral.reward === "paid"
                              ? "bg-green-100 text-green-800"
                              : referral.reward === "eligible"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {referral.reward}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* SMS Campaigns Tab */}
          <TabPanel>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiGift className="text-blue-500" /> SMS Campaigns
                </h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FiPlus /> Create SMS Campaign
                </button>
              </div>

              {/* SMS Content */}
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Flash Sale Alert!</h3>
                      <p className="text-gray-600">Sent to 1,234 customers</p>
                      <p className="text-sm text-gray-500 mt-2">
                        "Get 30% off this weekend only! Use code FLASH30"
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">2024-04-15</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Modals */}
      {showCampaignModal && <CampaignModal />}
    </div>
  );
}
