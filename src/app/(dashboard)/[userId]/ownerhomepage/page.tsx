"use client";
import {
  FiShare2,
  FiCopy,
  FiCheck,
  FiUsers,
  FiScissors,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { motion, useAnimation, useInView } from "framer-motion";
import { AnimatedButton } from "@/Components/ui/Button";
import Plans from "@/Components/ui/Pakage";

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
  const [showPlans, setShowPlans] = useState(false);
  const [, setUserData] = useState<{ activePlanId?: string | null }>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [daysOperating, setDaysOperating] = useState<number | null>(null);
  const [yearsOperating, setYearsOperating] = useState<number | null>(null);
  const [salonid, setsalonid] = useState("");
  const [, setImageLoaded] = useState(false);
  const [totalclients, settotalclient] = useState<number | null>(null);
  const [totalstaff, settotalstaff] = useState<number | null>(null);
  const [totalservice, settotalservice] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const url = window.location.origin;

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
      if (!userData.user?.salonId) throw new Error("Salon not found");
      setsalonid(userData.user.salonId);
    };
    getsalonid();
  }, [userid]);

  useEffect(() => {
    const checkActivePlan = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
        );
        const userData = await userResponse.json();
        setUserData(userData.user);
        if (!userData.user?.activePlanId) {
          setShowPlans(true);
        }
      } catch (error) {
        console.error("Error checking active plan:", error);
      }
    };
    checkActivePlan();
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
    if (salonid) {
      gettotalclients();
      gettotalstaff();
      gettotalservice();
    }
  }, [salonid]);

  useEffect(() => {
    const getsalon = async () => {
      const salonresponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/salon/getsalonbyid`,
        { id: salonid }
      );
      const mysalon = salonresponse.data.salon;
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
    if (salonid) getsalon();
  }, [salonid]);

  useEffect(() => {
    if (salon.salon_img_url) setImageLoaded(true);
  }, [salon.salon_img_url]);

  useEffect(() => {
    if (!salon?.opening_time) {
      setDaysOperating(null);
      setYearsOperating(null);
      return;
    }
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

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  const handleSelectPlan = async () => {};

  const handleUpdatePlan = () => {
    setShowPlans(true);
  };

  return (
    <div
      className="min-h-screen bg-[#fff9f7] relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e8c4c0 0.5px, transparent 0.5px)",
        backgroundSize: "15px 15px",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-[#b76e79] opacity-20"
          />
        </svg>
      </div>

      {showPlans && <Plans userid={userid} onSelectPlan={handleSelectPlan} />}

      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 py-12 relative z-10 mt-8"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8"
        >
          <div className="flex items-center gap-6">
            {salon.salon_img_url ? (
              <motion.div
                whileHover={{ rotate: -2, scale: 1.05 }}
                className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#e8c4c0] shadow-lg"
              >
                <Image
                  src={salon.salon_img_url}
                  alt={salon.salon_name}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-100"
                  onLoadingComplete={() => setImageLoaded(true)}
                />
              </motion.div>
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-2xl animate-pulse" />
            )}
            <div>
              {salon.salon_name ? (
                <>
                  <h1 className="text-4xl font-bold text-[#b76e79] font-dancing">
                    {salon.salon_name}
                  </h1>
                  <p className="text-lg text-[#7a5a57] mt-2">
                    {salon.salon_tag}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <AnimatedButton
              onClick={handleDashboardClick}
              variant="solid"
              hoverEffect="scale"
              gradient={["#b76e79", "#d8a5a5"]}
              className="mr-6 px-2 py-1 text-sm rounded-lg shadow-md hover:shadow-lg max-w-[200px] h-12 w-40"
              icon={<FiStar className="text-xs" />}
              iconPosition="left"
              isLoading={isNavigating}
            >
              {isNavigating ? "Loading..." : "Dashboard"}
            </AnimatedButton>
            <AnimatedButton
              onClick={handleUpdatePlan}
              variant="solid"
              hoverEffect="scale"
              gradient={["#b76e79", "#d8a5a5"]}
              className="mr-6 px-2 py-1 text-sm rounded-lg shadow-md hover:shadow-lg max-w-[200px] h-12 w-40"
              icon={<FiStar className="text-xs" />}
              iconPosition="left"
            >
              Updating Plans
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { value: yearsOperating, label: "Years Operating", icon: FiClock },
            { value: totalclients, label: "Loyal Clients", icon: FiUsers },
            { value: totalstaff, label: "Expert Staff", icon: FiScissors },
            { value: totalservice, label: "Premium Services", icon: FiStar },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl shadow-xl border border-[#e8c4c0]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#fff0ee] rounded-xl">
                  <stat.icon className="text-2xl text-[#b76e79]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#7a5a57]">
                    {stat.value !== null ? (
                      stat.value
                    ) : (
                      <div className="h-8 bg-gray-200 rounded w-12 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[#b76e79] font-medium">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Details Section */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Contact Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-2xl shadow-xl border border-[#e8c4c0]"
          >
            <h2 className="text-2xl font-dancing text-[#b76e79] mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#fff0ee] rounded-xl">
                <FiStar className="text-[#b76e79] flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#7a5a57]">Email</p>
                  {salon.contact_email ? (
                    <p className="font-medium text-[#b76e79]">
                      {salon.contact_email}
                    </p>
                  ) : (
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#fff0ee] rounded-xl">
                <FiStar className="text-[#b76e79] flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#7a5a57]">Phone</p>
                  {salon.contact_number ? (
                    <p className="font-medium text-[#b76e79]">
                      {salon.contact_number}
                    </p>
                  ) : (
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Share Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-2xl shadow-xl border border-[#e8c4c0]"
          >
            <h2 className="text-2xl font-dancing text-[#b76e79] mb-6">
              Share Your Salon
            </h2>
            <div className="space-y-6">
              <div className="bg-[#fff0ee] p-4 rounded-xl flex items-center gap-3">
                <input
                  value={salon.share_link}
                  readOnly
                  className="flex-1 bg-transparent text-[#7a5a57] font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-[#e8c4c0] rounded-lg transition-colors"
                >
                  {copySuccess ? (
                    <FiCheck className="text-[#b76e79] text-xl" />
                  ) : (
                    <FiCopy className="text-[#b76e79] text-xl" />
                  )}
                </button>
              </div>
              <AnimatedButton
                variant="solid"
                size="md" // Using md as base size
                hoverEffect="shine"
                gradient={["#b76e79", "#d8a5a5"]}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl hover:shadow-lg"
                icon={<FiShare2 className="text-lg" />}
                iconPosition="left"
              >
                Share on Social Media
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>

        {/* History Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white mt-16 p-8 rounded-2xl shadow-xl border border-[#e8c4c0]"
        >
          <h2 className="text-2xl font-dancing text-[#b76e79] mb-6">
            Salon Legacy
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#fff0ee] p-6 rounded-xl">
              <p className="text-sm text-[#7a5a57]">Established Since</p>
              {salon.opening_time ? (
                <p className="text-2xl font-bold text-[#b76e79]">
                  {new Date(salon.opening_time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : (
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mt-2" />
              )}
            </div>
            <div className="bg-[#fff0ee] p-6 rounded-xl">
              <p className="text-sm text-[#7a5a57]">Total Active Days</p>
              {daysOperating !== null ? (
                <p className="text-2xl font-bold text-[#b76e79]">
                  {daysOperating} Days
                </p>
              ) : (
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mt-2" />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/3 right-10 text-[#e8c4c0] text-4xl"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        ✦
      </motion.div>
    </div>
  );
};

export default OwnerHomepage;
