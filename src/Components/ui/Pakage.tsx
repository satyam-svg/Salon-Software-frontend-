"use client";
import { useState, useEffect, JSX } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiBox,
  FiGitBranch,
  FiClipboard,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

declare global {
  interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill: { email: string; contact: string };
    theme: { color: string };
  }

  interface Razorpay {
    new (options: RazorpayOptions): {
      open: () => void;
    };
  }

  interface Window {
    Razorpay: Razorpay;
  }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  branchLimit: number;
  features: string[];
}

interface PlansProps {
  userid: string;
  onSelectPlan: (planId: string) => void;
}

const Plans = ({ userid, onSelectPlan }: PlansProps) => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const featureIcons: { [key: string]: JSX.Element } = {
    appointments: <FiCalendar />,
    finance: <FiDollarSign />,
    clients: <FiUsers />,
    inventory: <FiBox />,
    branch: <FiGitBranch />,
    services: <FiClipboard />,
    feedback: <FiStar />,
    staff: <FiUsers />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, packagesResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userid}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/getall`
          ),
        ]);

        setActivePlanId(userResponse.data.user.activePlanId);
        setPackages(packagesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userid]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFreePlanActivation = async (pkgId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/buy`,
        {
          userId: userid,
          packageId: pkgId,
        }
      );

      // Update local state and parent component
      setActivePlanId(pkgId);
      onSelectPlan(pkgId);

      toast.success("🎊Plan activated sucessfuuly");
      window.location.reload();
    } catch (error) {
      console.error("Free plan activation failed:", error);
      alert("Error activating free plan. Please try again.");
    }
  };

  const handlePlanSelect = async (pkg: SubscriptionPackage) => {
    try {
      setProcessingPlan(pkg.id);

      if (pkg.price === 0) {
        await handleFreePlanActivation(pkg.id);
        return;
      }

      // Paid plan logic
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/buy`,
        {
          userId: userid,
          packageId: pkg.id,
        }
      );

      const order = orderResponse.data.data.order;
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load Razorpay SDK");

      const options = {
        key: process.env.NEXT_PUBLIC_RAXORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Salon Management System",
        description: pkg.name,
        order_id: order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            setActivePlanId(pkg.id);
            onSelectPlan(pkg.id);
            alert("Payment successful! Plan activated.");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: { email: "", contact: "" },
        theme: { color: "#b76e79" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Plan activation failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error processing request. Please try again."
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <div className="text-center p-8">Loading plans...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ border: "2px solid #e8c4c0" }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-dancing text-[#b76e79] mb-2">
              Choose Your Perfect Plan
            </h2>
            <p className="text-[#7a5a57]">
              Select the plan that best fits your salon needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isCurrentPlan = activePlanId === pkg.id;
              const isProcessing = processingPlan === pkg.id;

              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-[#fff9f7] rounded-2xl p-6 border-2 relative overflow-hidden ${
                    isCurrentPlan
                      ? "border-[#b76e79] ring-2 ring-[#b76e79]/20"
                      : "border-[#e8c4c0]"
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-[#b76e79] text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                      <FiCheck className="text-sm" />
                      <span>Current Plan</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[#b76e79]">
                      {pkg.name}
                    </h3>
                    <p className="text-2xl font-bold text-[#7a5a57] my-3">
                      {formatPrice(pkg.price)}
                      <span className="text-sm font-normal">/month</span>
                    </p>
                    <p className="text-sm text-[#7a5a57]">{pkg.description}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#7a5a57] mb-3">
                      <FiGitBranch className="text-[#b76e79]" />
                      <span>
                        {pkg.branchLimit === 9999
                          ? "Unlimited"
                          : pkg.branchLimit}{" "}
                        Branches
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pkg.features.map((featureId) => (
                      <div
                        key={featureId}
                        className="flex items-center gap-2 text-sm text-[#7a5a57]"
                      >
                        <span className="text-[#b76e79]">
                          {featureIcons[featureId]}
                        </span>
                        {featureId.charAt(0).toUpperCase() + featureId.slice(1)}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(pkg)}
                    disabled={isProcessing || isCurrentPlan}
                    className={`w-full mt-6 ${
                      isCurrentPlan
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : pkg.price === 0
                        ? "bg-[#e8c4c0] hover:bg-[#d8b4b0] text-[#7a5a57]"
                        : "bg-[#b76e79] hover:bg-[#a55d68] text-white"
                    } py-2 rounded-xl transition-colors flex items-center justify-center gap-2`}
                  >
                    {isCurrentPlan ? (
                      <>
                        <FiCheck />
                        <span>Activated</span>
                      </>
                    ) : isProcessing ? (
                      "Processing..."
                    ) : pkg.price === 0 ? (
                      "Activate Free Plan"
                    ) : (
                      "Choose Plan"
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-sm text-[#7a5a57]">
            <p>✨ 14-day money back guarantee</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Plans;
