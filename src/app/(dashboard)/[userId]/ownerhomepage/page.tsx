"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiShare2, FiCopy, FiCheck, FiStar, FiSettings } from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const floatingStars = Array(30).fill(null);

interface Salon {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  salon_img_url: string;
  share_link: string;
}

const OwnerHomepage = () => {
  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  const router = useRouter();

  const [copySuccess, setCopySuccess] = useState(false);
  const [daysOperating, setDaysOperating] = useState(0);
  const [yearsOperating, setYearsOperating] = useState(0);
  const [salonid, setsalonid] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  const [totalclients, settotalclient] = useState(0);
  const [totalstaff, settotalstaff] = useState(0);
  const [totalservice, settotalservice] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const url = window.location.origin;

  console.log(url);
  const handleDashboardClick = () => {
    setIsNavigating(true);
    router.push(`/${userid}/dashboard`);
  };
  const [salon, setsalon] = useState<Salon>({
    salon_name: "",
    salon_tag: "",
    opening_time: "",
    contact_email: "",
    contact_number: "",
    salon_img_url: "",
    share_link: `${url}/${userid}-u`,
  });

  useEffect(() => {
    const getsalonid = async () => {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      console.log(userData);

      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
      console.log(userResponse);
    };
    getsalonid();
  }, [userid]);

  useEffect(() => {
    const gettotalclients = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/number/totalclient/${salonid}`
      );
      settotalclient(response.data.totalClients);
    };
    const gettotalstaff = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/number/totalstaff/${salonid}`
      );
      settotalstaff(response.data.totalStaff);
    };
    const gettotalservice = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/number/totalservice/${salonid}`
      );
      settotalservice(response.data.totalServices);
    };
    gettotalclients();
    gettotalstaff();
    gettotalservice();
  }, [salonid]);

  useEffect(() => {
    const getsalon = async () => {
      const salonresponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/salon/getsalonbyid`,
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
        share_link: salon.share_link,
      });
    };
    getsalon();
  }, [salonid]);

  useEffect(() => {
    if (salon.salon_img_url) {
      setImageLoading(true);
    }
  }, [salon.salon_img_url]);

  useEffect(() => {
    if (!salon?.opening_time) return;

    const openedDate = new Date(salon.opening_time);
    const today = new Date();

    const diffTime = today.getTime() - openedDate.getTime();

    if (diffTime < 0) {
      setDaysOperating(0);
      setYearsOperating(0);
      return;
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let diffYears = today.getFullYear() - openedDate.getFullYear();
    const monthDiff = today.getMonth() - openedDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < openedDate.getDate())
    ) {
      diffYears--;
    }

    setDaysOperating(diffDays);
    setYearsOperating(Math.max(diffYears, 0));
  }, [salon]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(salon.share_link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingStars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-200"
            initial={{
              scale: 0,
              opacity: 0,
              x: Math.random() * 1000,
              y: Math.random() * 1000,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FiStar />
          </motion.div>
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12 relative z-10 grid gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Animated Salon Image */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative w-72 h-72 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            {salon.salon_img_url && (
              <Image
                src={salon.salon_img_url}
                alt={salon.salon_name}
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform"
                onLoadingComplete={() => setImageLoading(false)}
              />
            )}

            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-400 border-l-pink-400 animate-spin animation-reverse animation-duration-2s"></div>
                </div>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-pink-900/20"
            />
          </motion.div>

          {/* Salon Info */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="flex-1 space-y-6"
          >
            <motion.h1
              className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {salon.salon_name.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="text-2xl text-gray-600 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {salon.salon_tag}
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center bg-white px-8 py-4 rounded-full shadow-lg relative overflow-hidden"
            >
              <FiStar className="text-yellow-400 mr-2 text-xl z-10" />
              <span className="font-medium z-10">
                Celebrating {yearsOperating}+ Years of Excellence
              </span>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="absolute inset-0 bg-purple-100 rounded-full"
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
            <motion.div
              className=""
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              <motion.button
                whileHover={
                  !isNavigating ? { scale: 1.05, translateY: -2 } : {}
                }
                whileTap={!isNavigating ? { scale: 0.98 } : {}}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                onClick={handleDashboardClick}
                disabled={isNavigating}
              >
                {/* Loading overlay */}
                {isNavigating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-purple-600/90 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-white"
                    >
                      <FiSettings className="w-6 h-6" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Default content */}
                <motion.div
                  animate={{ opacity: isNavigating ? 0 : 1 }}
                  className="flex items-center gap-2"
                >
                  <span>Manage Salon Dashboard</span>
                  <motion.div
                    animate={{
                      x: ["0%", "20%", "0%"],
                      transition: { repeat: Infinity, duration: 2 },
                    }}
                  >
                    <FiSettings className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {[
            { value: daysOperating, label: "Days Operating", color: "purple" },
            {
              value: totalclients,
              label: "Happy Customers",
              color: "pink",
            },
            {
              value: totalstaff,
              label: "Expert Staff",
              color: "purple",
            },
            {
              value: totalservice,
              label: "Services Offered",
              color: "pink",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-3xl shadow-2xl bg-white relative overflow-hidden border-l-8 border-${stat.color}-500`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`text-5xl font-bold text-${stat.color}-600 mb-4`}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stat.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {stat.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-gray-500 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Share Section */}
        <motion.div
          className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
        >
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-2">Your Salon Link</h2>
              <p className="opacity-90 text-lg">
                Share this magical link with your customers
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm flex-1 relative overflow-hidden">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={salon.share_link}
                    readOnly
                    className="bg-transparent text-white flex-1 min-w-0 text-lg font-mono"
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-purple-200 transition-colors"
                  >
                    <AnimatePresence mode="wait">
                      {copySuccess ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FiCheck className="text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FiCopy />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 15 }}
                className="bg-white/20 hover:bg-white/30 p-4 rounded-xl text-white transition-all"
              >
                <FiShare2 className="text-2xl" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard CTA */}
      </motion.div>

      {/* Background Effects */}
      <motion.div
        className="fixed inset-0 pointer-events-none -z-10"
        animate={{
          background: [
            "linear-gradient(45deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(135deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(225deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
            "linear-gradient(315deg, #f3e8ffaa 0%, #fbcfe8aa 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default OwnerHomepage;
