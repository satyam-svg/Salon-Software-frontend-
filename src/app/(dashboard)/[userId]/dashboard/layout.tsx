"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiX,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiStar,
  FiClipboard,
  FiBarChart2,
  FiGitBranch,
  FiLock,
} from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatedButton } from "@/Components/ui/Button";
import axios from "axios";

interface SubscriptionPackage {
  id: string;
  features: string[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePlan, setActivePlan] = useState<SubscriptionPackage | null>(
    null
  );
  const [loadingPlan, setLoadingPlan] = useState(true);
  const arrowRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const userid = pathname.split("/")[1];

  const isActiveLink = (href: string) => {
    if (href === `/${userid}/dashboard/`) {
      return pathname === href || pathname === `/${userid}/dashboard`;
    }
    return pathname === href;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
        );
        const activePlanId = userRes.data.user?.activePlanId;
        console.log("paln id", activePlanId)
        if (activePlanId) {
          const planRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/${activePlanId}`
          );
          console.log("plan res",planRes.data.data);
          setActivePlan(planRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchActivePlan();
  }, [userid]);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      if (isMobile) setIsSidebarOpen(false);
    }
  };

  const featureConfig = {
    Dashboard: { alwaysAllowed: true },
    Settings: { alwaysAllowed: true },
    Appointments: { featureId: "appointments" },
    Finance: { featureId: "finance" },
    Clients: { featureId: "clients" },
    Inventory: { featureId: "inventory" },
    Branch: { featureId: "branch" },
    Services: { featureId: "services" },
    Feedback: { featureId: "feedback" },
    Staffs: { featureId: "staff" },
  };

  const isFeatureAllowed = (featureName: string) => {
    if (featureConfig[featureName as keyof typeof featureConfig]?.alwaysAllowed)
      return true;

    const featureId =
      featureConfig[featureName as keyof typeof featureConfig]?.featureId;
    return activePlan?.features.includes(featureId);
  };

  const navItems = [
    {
      icon: <FiBarChart2 className="text-[#b76e79]" />,
      label: "Dashboard",
      href: `/${userid}/dashboard/`,
    },
    {
      icon: <FiCalendar className="text-[#b76e79]" />,
      label: "Appointments",
      href: `/${userid}/dashboard/Appointement`,
    },
    {
      icon: <FiDollarSign className="text-[#b76e79]" />,
      label: "Finance",
      href: `/${userid}/dashboard/finance`,
    },
    {
      icon: <FiUsers className="text-[#b76e79]" />,
      label: "Clients",
      href: `/${userid}/dashboard/Clients`,
    },
    {
      icon: <FiBox className="text-[#b76e79]" />,
      label: "Inventory",
      href: `/${userid}/dashboard/inventory`,
    },
    {
      icon: <FiGitBranch className="text-[#b76e79]" />,
      label: "Branch",
      href: `/${userid}/dashboard/branch`,
    },
    {
      icon: <FiClipboard className="text-[#b76e79]" />,
      label: "Services",
      href: `/${userid}/dashboard/service`,
    },
    {
      icon: <FiStar className="text-[#b76e79]" />,
      label: "Feedback",
      href: `/${userid}/dashboard/feedback`,
    },
    {
      icon: <FiUsers className="text-[#b76e79]" />,
      label: "Staffs",
      href: `/${userid}/dashboard/staff`,
    },
    {
      icon: <FiSettings className="text-[#b76e79]" />,
      label: "Settings",
      href: `/${userid}/dashboard/setting`,
    },
  ];

  return (
    <div
      className="flex h-screen bg-[#fff9f7] overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e8c4c0 0.5px, transparent 0.5px)",
        backgroundSize: "15px 15px",
      }}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: transparent;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {isMobile && !isSidebarOpen && (
        <motion.button
          ref={arrowRef}
          onClick={() => setIsSidebarOpen(true)}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-[#b76e79] text-white rounded-r-full shadow-lg hover:bg-[#d8a5a5] transition-colors"
        >
          <FiChevronRight className="text-xl" />
        </motion.button>
      )}

      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <motion.nav
            initial={{ x: isMobile ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`h-full bg-white shadow-xl ${
              isMobile ? "fixed inset-y-0 left-0 w-64 z-40" : "w-64"
            } overflow-y-auto border-r border-[#e8c4c0]`}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4 mt-10">
                {loadingPlan ? (
                  <div className="text-center text-[#7a5a57]">
                    Loading features...
                  </div>
                ) : (
                  navItems.map((item) => {
                    const isAllowed = isFeatureAllowed(item.label);
                    const isActive = isActiveLink(item.href);

                    return (
                      <motion.div
                        key={item.label}
                        whileHover={{ x: isAllowed ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div
                          className={`flex items-center gap-3 p-3 transition-colors ${
                            isActive
                              ? "bg-[#fff0ee] text-[#b76e79] border-l-4 border-[#b76e79]"
                              : "text-[#7a5a57] hover:text-[#b76e79]"
                          } ${
                            !isAllowed ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {!isAllowed && (
                            <FiLock className="text-[#b76e79] flex-shrink-0" />
                          )}
                          {isAllowed ? (
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 flex-1"
                              onClick={() => handleNavigation(item.href)}
                            >
                              {item.icon}
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ) : (
                            <>
                              {item.icon}
                              <span className="font-medium">{item.label}</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}

                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-10"
                  >
                    <AnimatedButton
                      onClick={() => setIsSidebarOpen(false)}
                      variant="solid"
                      hoverEffect="scale"
                      gradient={["#b76e79", "#d8a5a5"]}
                      className="w-full flex items-center justify-center gap-2 py-3"
                      icon={<FiX className="text-sm" />}
                      iconPosition="left"
                    >
                      Close Sidebar
                    </AnimatedButton>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.main
        className={`flex-1 h-full overflow-auto p-4 lg:p-8 mt-10 ${
          !isMobile && isSidebarOpen ? "ml-64" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-full h-32 overflow-hidden -z-10">
          <svg
            className="absolute top-0 right-0 w-full h-full"
            viewBox="0 0 1200 120"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              className="fill-[#b76e79] opacity-20"
            />
          </svg>
        </div>

        {children}
      </motion.main>
    </div>
  );
}
