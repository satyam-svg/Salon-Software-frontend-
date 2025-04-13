"use client";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiClock,
  FiStar,
  FiScissors,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";

const staffMember = {
  id: 1,
  name: "Sarah Johnson",
  role: "Senior Stylist",
  photo:
    "https://img.freepik.com/free-photo/two-hairstylers-posing-standing-modern-spacy-beaty-salon_651396-986.jpg?semt=ais_hybrid&w=740", // Replace with your image path
  bio: "Award-winning hairstylist with 8+ years of experience in modern hair techniques. Specializes in color transformation and bridal styling.",
  contact: {
    email: "sarah@luxsalon.com",
    phone: "+1 (555) 123-4567",
    address: "123 Beauty Lane, New York, NY 10001",
  },
  stats: {
    rating: "4.9",
    experience: "8 years",
    clients: "1200+",
    retention: "95%",
  },
  services: [
    { name: "Premium Hair Coloring", price: "$180+", duration: "2-3 hrs" },
    { name: "Keratin Treatment", price: "$300", duration: "4 hrs" },
    { name: "Bridal Package", price: "$600", duration: "5 hrs" },
    { name: "Haircut & Styling", price: "$90", duration: "1 hr" },
  ],
  schedule: [
    { day: "Mon", time: "9:00 AM - 7:00 PM" },
    { day: "Wed", time: "10:00 AM - 8:00 PM" },
    { day: "Fri", time: "9:00 AM - 6:00 PM" },
    { day: "Sat", time: "10:00 AM - 4:00 PM" },
  ],
  recentClients: [
    { name: "Emma Wilson", service: "Balayage Highlights", date: "2024-03-15" },
    { name: "Michael Chen", service: "Beard Grooming", date: "2024-03-14" },
    { name: "Sophia Rodriguez", service: "Bridal Makeup", date: "2024-03-13" },
  ],
};

export default function StaffProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={staffMember.photo}
              alt={staffMember.name}
              width={200}
              height={200}
              className="rounded-full border-4 border-purple-100 shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {staffMember.name}
              </h1>
              <p className="text-xl text-purple-600 font-medium mb-4">
                {staffMember.role}
              </p>
              <p className="text-gray-600 max-w-2xl">{staffMember.bio}</p>

              <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                  <FiStar className="text-yellow-400 text-xl" />
                  <span className="font-semibold">
                    {staffMember.stats.rating} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <FiClock className="text-blue-500 text-xl" />
                  <span className="font-semibold">
                    {staffMember.stats.experience} Experience
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-lg">
                  <FiUser className="text-pink-500 text-xl" />
                  <span className="font-semibold">
                    {staffMember.stats.clients} Clients
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiScissors className="text-purple-500" />
                Offered Services
              </h2>
              <div className="space-y-4">
                {staffMember.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {service.duration}
                      </p>
                    </div>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                      {service.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Schedule Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiCalendar className="text-blue-500" />
                Availability
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {staffMember.schedule.map((day, index) => (
                  <div
                    key={index}
                    className="p-4 text-center bg-blue-50 rounded-xl"
                  >
                    <p className="font-bold text-blue-600 text-lg">{day.day}</p>
                    <p className="text-sm text-gray-600">{day.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiUser className="text-pink-500" />
                Contact Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg">
                  <FiMail className="text-purple-500 text-xl" />
                  <a
                    href={`mailto:${staffMember.contact.email}`}
                    className="text-gray-600 hover:text-purple-600"
                  >
                    {staffMember.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg">
                  <FiPhone className="text-purple-500 text-xl" />
                  <a
                    href={`tel:${staffMember.contact.phone}`}
                    className="text-gray-600 hover:text-purple-600"
                  >
                    {staffMember.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg">
                  <FiMapPin className="text-purple-500 text-xl" />
                  <span className="text-gray-600">
                    {staffMember.contact.address}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Clients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiStar className="text-yellow-500" />
                Recent Clients
              </h2>
              <div className="space-y-4">
                {staffMember.recentClients.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-purple-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-purple-600">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">{client.service}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiDollarSign className="text-green-500" />
                Performance
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-green-600">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Client Retention</span>
                  <span className="font-semibold text-purple-600">
                    {staffMember.stats.retention}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Rating</span>
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-400" />
                    <span className="font-semibold">
                      {staffMember.stats.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
