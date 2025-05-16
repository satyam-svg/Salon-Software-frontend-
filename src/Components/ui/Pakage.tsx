// Components/Plans.tsx
"use client";
import { useState, useEffect } from "react";
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
  FiX,
  FiCreditCard,
} from "react-icons/fi";

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  branchLimit: number;
  features: string[];
}


interface PaymentDialogProps {
  plan: SubscriptionPackage;
  onClose: () => void;
  onProceed: () => void;
}
const PaymentDialog = ({ plan, onClose, onProceed }: PaymentDialogProps) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      style={{ border: "2px solid #e8c4c0" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-dancing text-[#b76e79]">Payment Details</h3>
        <button onClick={onClose} className="text-[#7a5a57] hover:text-[#b76e79]">
          <FiX className="text-2xl" />
        </button>
      </div>

      <div className="bg-[#fff0ee] p-4 rounded-xl mb-6">
        <div className="flex justify-between text-[#7a5a57] mb-2">
          <span>Plan:</span>
          <span className="font-medium">{plan.name}</span>
        </div>
        <div className="flex justify-between text-[#7a5a57]">
          <span>Amount:</span>
          <span className="font-medium text-[#b76e79]">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(plan.price)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-[#e8c4c0] rounded-xl p-3">
          <label className="text-sm text-[#7a5a57]">Card Number</label>
          <div className="flex items-center gap-2 mt-1">
            <FiCreditCard className="text-[#b76e79]" />
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#e8c4c0] rounded-xl p-3">
            <label className="text-sm text-[#7a5a57]">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="border border-[#e8c4c0] rounded-xl p-3">
            <label className="text-sm text-[#7a5a57]">CVC</label>
            <input
              type="text"
              placeholder="123"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <button
          onClick={onProceed}
          className="w-full bg-[#b76e79] hover:bg-[#a55d68] text-white py-3 rounded-xl transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    </motion.div>
  </div>
);

interface PlansProps {
  userid: string;
  onSelectPlan: (planId: string) => void;
}

const Plans = ({ userid, onSelectPlan }: PlansProps) => {
  
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/getall`
        );
        setPackages(response.data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  const handlePlanSelect = async (pkg: SubscriptionPackage) => {
  if (pkg.price === 0) {
    setIsProcessing(true);
    try {
      // Directly activate free plan
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/plans/purchase`, {
        userId: userid,
        packageId: pkg.id
      });
      window.location.reload(); // Force refresh to update UI
    } catch (error) {
      console.error('Activation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  } else {
    // Only show payment dialog for paid plans
    setSelectedPlan(pkg);
  }
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
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ scale: 1.05 }}
                className="bg-[#fff9f7] rounded-2xl p-6 border-2 border-[#e8c4c0]"
              >
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
                      {pkg.branchLimit === 9999 ? "Unlimited" : pkg.branchLimit} Branches
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {pkg.features.map((featureId) => (
                    <div key={featureId} className="flex items-center gap-2 text-sm text-[#7a5a57]">
                      <span className="text-[#b76e79]">
                        {featureIcons[featureId]}
                      </span>
                      {featureId.charAt(0).toUpperCase() + featureId.slice(1)}
                    </div>
                  ))}
                </div>

                <button
            onClick={() => handlePlanSelect(pkg)}
            disabled={isProcessing}
            className={`w-full mt-6 ${
              pkg.price === 0 
                ? 'bg-[#e8c4c0] hover:bg-[#d8b4b0] text-[#7a5a57]' 
                : 'bg-[#b76e79] hover:bg-[#a55d68] text-white'
            } py-2 rounded-xl transition-colors`}
          >
            {isProcessing && pkg.price === 0 ? (
              'Activating...'
            ) : pkg.price === 0 ? (
              'Activate Free Plan'
            ) : (
              'Choose Plan'
            )}
          </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-[#7a5a57]">
            <p>✨ 14-day money back guarantee</p>
          </div>
        </div>
      </motion.div>
       {selectedPlan && selectedPlan.price > 0 && (
  <PaymentDialog
    plan={selectedPlan}
    onClose={() => setSelectedPlan(null)}
    onProceed={() => {
      // Empty for now, just close dialog
      setSelectedPlan(null);
    }}
  />
)}
    </div>
  );
};

export default Plans;




