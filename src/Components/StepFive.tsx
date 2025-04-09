import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaClock, FaPhone, FaEnvelope, FaMapMarker } from "react-icons/fa";
import { FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";

interface Staff {
  fullname: string;
  email: string;
  contact: string;
  profile_img: string;
  staff_id: string;
}

interface Product {
  product_name: string;
  product_quantity: number;
  price: number;
}

interface Service {
  service_name: string;
  service_price: number;
  time: string;
}

interface Branch {
  id: string;
  branch_name: string;
  branch_location: string;
  opning_time: string;
  closeings_time: string;
  contact_email: string;
  contact_number: string;
  serviceCount: number;
  inventoryCount: number;
  staffCount: number;
  staff: Staff[];
  inventory: Product[];
  service: Service[];
}

interface Salon {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  salon_img_url: string;
}

const SalonPage = ({ setStep }: { setStep: (step: number) => void }) => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [salonid, setsalonid] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);

  const [salon, setsalon] = useState<Salon>({
    salon_name: "",
    salon_tag: "",
    opening_time: "",
    contact_email: "",
    contact_number: "",
    salon_img_url: "",
  });

  useEffect(() => {
    const getsalonid = async () => {
      const userResponse = await fetch(
        `https://salon-backend-3.onrender.com/api/users/${userId}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
      console.log(userResponse);
    };
    getsalonid();
  }, [userId]);

  useEffect(() => {
    const getsalon = async () => {
      const salonresponse = await axios.post(
        `https://salon-backend-3.onrender.com/api/salon/getsalonbyid`,
        {
          id: salonid,
        }
      );
      const mysalon = salonresponse.data.salon;
      console.log(mysalon);

      setsalon({
        salon_name: mysalon.salon_name,
        salon_tag: mysalon.salon_tag,
        salon_img_url: mysalon.salon_img_url,
        opening_time: mysalon.opening_time,
        contact_email: mysalon.contact_email,
        contact_number: mysalon.contact_number,
      });
    };
    getsalon();
  }, [salonid]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://salon-backend-3.onrender.com/api/branch/isbranch",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ salon_id: salonid }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch branches");

        const data = await response.json();
        console.log(data.branches);

        // console.log(data.branches.staff, "this is");
        console.log(data.branches[0].staff, "this is data");
        setBranches(
          data.branches.map((branch: Branch) => ({
            id: branch.id,
            branch_name: branch.branch_name,
            branch_location: branch.branch_location,
            opning_time: branch.opning_time,
            closeings_time: branch.closeings_time,
            contact_email: branch.contact_email,
            contact_number: branch.contact_number,
            serviceCount: branch.serviceCount,
            inventoryCount: branch.inventoryCount,
            staffCount: branch.staffCount,
            staff: branch.staff,
            inventory: branch.inventory,
            service: branch.service,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchBranches();
  }, [salonid]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-pink-900/40" />
        <Image
          src={salon.salon_img_url}
          alt={salon.salon_name}
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 text-center pb-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-white mb-4 drop-shadow-2xl"
          >
            {salon.salon_name}
          </motion.h1>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-xl text-pink-100 font-medium mb-6"
          >
            {salon.salon_tag}
          </motion.p>
          <div className="flex justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-pink-100 border border-white/20"
            >
              <FaPhone className="mr-2 text-pink-200" />
              <span className="font-medium">{salon.contact_number}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-pink-100 border border-white/20"
            >
              <FaEnvelope className="mr-2 text-pink-200" />
              <span className="font-medium">{salon.contact_email}</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
  
      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-gray-800 mb-12 text-center"
        >
          Our <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Branches</span>
        </motion.h2>
  
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {branches.map((branch, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 backdrop-blur-sm"
            >
              <div className="p-6">
                {/* Branch Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {branch.branch_name}
                  </h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <FaMapMarker className="mr-2 text-purple-500" />
                    <span className="truncate">{branch.branch_location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2 text-pink-500" />
                    <span>{branch.opning_time} - {branch.closeings_time}</span>
                  </div>
                </div>
  
                {/* Staff Gallery */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-3">Featured Staff</h4>
                  <div className="flex flex-wrap gap-2">
                    {branch.staff.map((staff, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        className="relative group"
                      >
                        <Image
                          src={staff.profile_img}
                          alt={staff.fullname}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-white p-2 rounded-lg shadow-lg mb-2">
                          <p className="text-sm font-medium">{staff.fullname}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
  
                {/* Products & Services */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                      <FiPackage className="mr-2 text-purple-500" />
                      Products
                    </h4>
                    <div className="space-y-2">
                      {branch.inventory.map((product, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 10 }}
                          className="flex justify-between items-center bg-purple-50/30 p-3 rounded-lg"
                        >
                          <span className="font-medium">{product.product_name}</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm">
                              ${product.price}
                            </span>
                            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-sm">
                              Qty: {product.product_quantity}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
  
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                      <FiShoppingBag className="mr-2 text-pink-500" />
                      Services
                    </h4>
                    <div className="space-y-2">
                      {branch.service.map((service, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 10 }}
                          className="flex justify-between items-center bg-pink-50/30 p-3 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{service.service_name}</span>
                            <span className="block text-sm text-gray-500">{service.time}</span>
                          </div>
                          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                            ${service.service_price}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
  
        {/* Action Section */}
        <motion.div 
          className="mt-16 text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Confirm & Publish Salon
            <FiCheckCircle className="inline-block ml-3 text-xl" />
          </motion.button>
  
          <div className="text-gray-600">
            Need changes?{' '}
            <motion.a
              href="/dashboard"
              className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Visit your dashboard
            </motion.a>{' '}
            to update details
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SalonPage;
