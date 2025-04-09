import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMapMarker,
  FaSpinner,
} from "react-icons/fa";
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
  const [isLoading, setIsLoading] = useState(true);

  const [salon, setsalon] = useState<Salon>({
    salon_name: "",
    salon_tag: "",
    opening_time: "",
    contact_email: "",
    contact_number: "",
    salon_img_url: "",
  });

  useEffect(() => {
    if (salon.salon_name && branches.length > 0) {
      setTimeout(() => setIsLoading(false), 1500); // Simulate loading delay
    }
  }, [salon, branches]);

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

  const LoadingSkeleton = () => (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="text-purple-600 text-4xl"
      >
        <FaSpinner />
      </motion.div>
    </div>
  );

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
  const router = useRouter();
  const updateStep = async () => {
    const salonData = {
      salonId: salonid,
      step: 5,
      user_id: userId,
    };

    // Submit to backend
    const response = await fetch(
      "https://salon-backend-3.onrender.com/api/salon/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salonData),
      }
    );
    console.log(response);
    router.push(`/${userId}/ownerhomepage`);
    setStep(6);
  };

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

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative overflow-hidden ">
        {/* Floating decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-20 w-40 h-40 rounded-full bg-purple-300 blur-3xl -z-10"
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-pink-300 blur-3xl -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="md:w-1/2 space-y-8 relative z-10"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
              >
                {salon.salon_name}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
                >
                  {salon.salon_tag}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-600"
              >
                {salon.opening_time}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-4"
            >
              <motion.a
                href={`tel:${salon.contact_number}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-gray-700 hover:text-purple-700 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  className="p-2 bg-purple-100 rounded-full"
                >
                  <FaPhone className="text-purple-600 text-xl" />
                </motion.div>
                <span className="font-medium">{salon.contact_number}</span>
              </motion.a>

              <motion.a
                href={`mailto:${salon.contact_email}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-gray-700 hover:text-pink-700 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  className="p-2 bg-pink-100 rounded-full"
                >
                  <FaEnvelope className="text-pink-600 text-xl" />
                </motion.div>
                <span className="font-medium">{salon.contact_email}</span>
              </motion.a>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="pt-4"
            ></motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.2,
            }}
            className="md:w-1/2 relative"
          >
            <motion.div
              whileHover={{ rotate: 0 }}
              initial={{ rotate: 3 }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src={salon.salon_img_url}
                alt={salon.salon_name}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            <motion.div
              initial={{ rotate: -3, opacity: 0.7 }}
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-3xl -z-10"
            />

            {/* Floating decorative elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 -z-20"
            />
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-8 -right-8 w-40 h-40 bg-pink-200 rounded-full blur-xl opacity-30 -z-20"
            />
          </motion.div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-gray-900 mb-12 text-center"
        >
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Branches
          </span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {branches.map((branch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FaMapMarker className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {branch.branch_name}
                        </h3>
                        <p className="text-gray-500">
                          {branch.branch_location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="text-pink-500" />
                      <span>
                        {branch.opning_time} - {branch.closeings_time}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-500 w-1 h-6 rounded-full" />
                      Featured Team
                    </h4>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3">
                      {branch.staff.map((staff, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          className="relative group cursor-pointer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          {/* Avatar with gradient border */}
                          <div className="p-0.5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400">
                            <Image
                              src={staff.profile_img}
                              alt={staff.fullname}
                              width={64}
                              height={64}
                              className="rounded-full border-2 border-white shadow-lg object-cover aspect-square"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/default-avatar.svg";
                              }}
                            />
                          </div>

                          {/* Hover Card */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block mb-3 w-max">
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white p-3 rounded-xl shadow-lg border border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={staff.profile_img}
                                  alt={staff.fullname}
                                  width={40}
                                  height={40}
                                  className="rounded-full border-2 border-white"
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {staff.fullname}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <FaPhone className="text-purple-500 text-xs" />
                                    <span>{staff.contact}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FiShoppingBag className="text-purple-600" />
                        Top Services
                      </h4>
                      <div className="space-y-2">
                        {branch.service.slice(0, 3).map((service, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium">
                              {service.service_name}
                            </span>
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                              ${service.service_price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FiPackage className="text-pink-600" />
                        Popular Products
                      </h4>
                      <div className="space-y-2">
                        {branch.inventory.slice(0, 3).map((product, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium">
                              {product.product_name}
                            </span>
                            <div className="flex gap-2">
                              <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-sm">
                                Qty: {product.product_quantity}
                              </span>
                              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm">
                                ${product.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => {
              updateStep();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
          >
            Publish Your Salon
            <FiCheckCircle className="text-xl" />
          </motion.button>

          <div className="text-gray-600">
            Need changes?{" "}
            <motion.a
              onClick={() => {
                updateStep();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Visit your dashboard
            </motion.a>{" "}
            to update details
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SalonPage;
