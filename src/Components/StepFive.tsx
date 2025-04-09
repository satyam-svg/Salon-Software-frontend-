import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaClock, FaPhone, FaEnvelope, FaMapMarker } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-96"
      >
        <Image
          src={salon.salon_img_url}
          alt={salon.salon_name}
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold mb-2"
            >
              {salon.salon_name}
            </motion.h1>
            <p className="text-xl">{salon.salon_tag}</p>
            <div className="mt-4 flex gap-4 justify-center">
              <div className="flex items-center">
                <FaPhone className="mr-2" />
                {salon.contact_number}
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                {salon.contact_email}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Branches</h2>
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
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {branch.branch_name}
                </h3>
                <div className="flex items-center mb-2 text-gray-600">
                  <FaMapMarker className="mr-2" />
                  {branch.branch_location}
                </div>
                <div className="flex items-center mb-2 text-gray-600">
                  <FaClock className="mr-2" />
                  {branch.opning_time} - {branch.closeings_time}
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaEnvelope className="mr-2" />
                  {branch.contact_email}
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaPhone className="mr-2" />
                  {branch.contact_number}
                </div>

                <div className="mt-4">
                  <h4 className="font-bold mb-2">Staff</h4>
                  <div className="flex flex-wrap gap-2">
                    {branch.staff.map((staff, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                      >
                        <Image
                          src={staff.profile_img}
                          alt={staff.fullname}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="ml-2 text-sm">{staff.fullname}</span>
                        <span className="ml-2 text-sm">{staff.email}</span>
                        <span className="ml-2 text-sm">{staff.contact}</span>
                        <span className="ml-2 text-sm">{staff.staff_id}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold mb-2">Products</h4>
                  <div className="space-y-2">
                    {branch.inventory.map((product, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 10 }}
                        className="flex justify-between bg-pink-50 p-2 rounded"
                      >
                        <span>{product.product_name}</span>
                        <span>${product.price}</span>
                        <span>${product.product_quantity}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold mb-2">Services</h4>
                  <div className="space-y-2">
                    {branch.service.map((service, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 10 }}
                        className="flex justify-between bg-purple-50 p-2 rounded"
                      >
                        <div>
                          <span>{service.service_name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({service.time})
                          </span>
                        </div>
                        <span>${service.service_price}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SalonPage;
