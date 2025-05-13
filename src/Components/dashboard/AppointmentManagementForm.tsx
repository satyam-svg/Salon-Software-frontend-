"use client";
import { useState, memo, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPlusCircle,
  FiArrowRight,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useClients } from "@/hooks/useClients";
import { useSalonBranches } from "@/hooks/useSalonBranches";

// Interfaces
interface AutocompleteFieldProps {
  label: string;
  icon: React.ReactNode;
  options: string[];
  value: string;
  setValue: (val: string) => void;
  error: boolean;
  required?: boolean;
  disabled?: boolean;
}

interface FormErrors {
  branch?: boolean;
  staff?: boolean;
  service?: boolean;
  client?: boolean;
  datetime?: boolean;
  fetchError?: string;
}

interface StaffResponse {
  id: string;
  fullname: string;
}

interface ClientOption {
  label: string;
  id: string;
  email: string;
  name: string;
}

interface ServiceResponse {
  id: string;
  service_name: string;
  service_price: number;
}

interface Branchapiresponse {
  id: string;
  branch_name: string;
  staff: StaffResponse[];
  service: ServiceResponse[];
}

interface ClientResponse {
  id: string;
  client_name: string;
  email: string;
}

const AutocompleteField = memo(
  ({
    label,
    icon,
    options,
    value,
    setValue,
    error,
    required,
    disabled,
  }: AutocompleteFieldProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (value) setSearchQuery(value);
    }, [value]);

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div variants={itemVariants} className="relative mb-4">
        <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
          {icon}
          <span className="ml-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>

        <div className="relative">
          <div className="flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setValue("");
                setIsOpen(true);
              }}
              onFocus={() => !disabled && setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              className={`w-full pl-10 pr-8 py-2 rounded-lg border ${
                error ? "border-red-400" : "border-gray-200"
              } focus:ring-2 ${
                error ? "focus:ring-red-200" : "focus:ring-blue-200"
              } focus:border-transparent bg-white transition-all ${
                disabled ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder={
                disabled
                  ? "Select branch first..."
                  : `Select ${label.toLowerCase()}...`
              }
              disabled={disabled}
            />
            <div className="absolute left-3 text-gray-400">{icon}</div>
            {searchQuery && !disabled && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setValue("");
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <FiX />
              </button>
            )}
          </div>

          <AnimatePresence>
            {!disabled && isOpen && filteredOptions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto"
              >
                {filteredOptions.map((option) => (
                  <motion.li
                    key={option}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-sm"
                    onMouseDown={() => {
                      setValue(option);
                      setSearchQuery(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mt-1 text-red-500 text-xs"
          >
            <FiAlertCircle className="mr-1" />
            Please select a {label.toLowerCase()}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AutocompleteField.displayName = "AutocompleteField";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.3 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const AppointmentManagementForm = ({
  setformbtn,
}: {
  setformbtn: (value: boolean) => void;
}) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using custom hooks
  const {
    data: salonData,
    error: branchesError,
    isLoading: branchesLoading,
  } = useSalonBranches(userId);
  const { data: clients, error: clientsError } = useClients(salonData?.salonId);

  useEffect(() => {
    if (branchesError) toast.error(branchesError.message);
    if (clientsError) toast.error("Failed to load clients");
  }, [branchesError, clientsError]);

  // Derived data
  const selectedBranchData = useMemo(
    () =>
      salonData?.branches.find(
        (b: Branchapiresponse) => b.branch_name === selectedBranch
      ),
    [salonData?.branches, selectedBranch]
  );

  const staffOptions = useMemo(
    () => selectedBranchData?.staff.map((s: StaffResponse) => s.fullname) || [],
    [selectedBranchData]
  );

  const serviceOptions = useMemo(
    () =>
      selectedBranchData?.service.map((s: ServiceResponse) => s.service_name) ||
      [],
    [selectedBranchData]
  );

  const clientOptions = useMemo<ClientOption[]>(
    () =>
      clients?.map((c: ClientResponse) => ({
        label: `${c.client_name} (${c.email})`,
        id: c.id,
        email: c.email,
        name: c.client_name,
      })) || [],
    [clients]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors = {
        branch: !selectedBranch,
        staff: !selectedStaff,
        service: !selectedService,
        client: !selectedClient,
        datetime: !dateTime,
      };
      setErrors(newErrors);
      if (Object.values(newErrors).some((error) => error)) return;

      try {
        setIsSubmitting(true);
        const branch = salonData?.branches.find(
          (b: Branchapiresponse) => b.branch_name === selectedBranch
        );
        const staff = branch?.staff.find(
          (s: StaffResponse) => s.fullname === selectedStaff
        );
        const service = branch?.service.find(
          (s: ServiceResponse) => s.service_name === selectedService
        );

        if (!branch || !staff || !service || !salonData) {
          throw new Error("Invalid selection");
        }

        const [date, time] = dateTime.split("T");
        if (!date || !time) throw new Error("Invalid datetime");

        // Create appointment
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/appoiment/create`,
          {
            salon_id: salonData.salonId,
            branch_id: branch.id,
            staff_id: staff.id,
            service_id: service.id,
            client_id: selectedClient,
            date,
            time,
            status: "pending",
          }
        );

        if (response.data.message === "Appointment created successfully") {
          // Send confirmation email
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/email/appointmentemail`,
            {
              to: clientEmail,
              customerName: clientName,
              appointmentDate: date,
              salonName: salonData.salon.salon_name,
              branchName: branch.branch_name,
              staffName: staff.fullname,
              services: [
                {
                  name: service.service_name,
                  price: service.service_price,
                },
              ],
              totalAmount: service.service_price,
            }
          );

          toast.success("Appointment created!");
          setformbtn(false);
        }
      } catch (error) {
        toast.error("Failed to create appointment");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedBranch,
      selectedStaff,
      selectedService,
      selectedClient,
      dateTime,
      salonData,
      clientEmail,
      clientName,
      setformbtn,
    ]
  );

  const handleClientChange = useCallback(
    (val: string) => {
      const selected = clientOptions.find((opt) => opt.label === val);
      setSelectedClient(selected?.id || "");
      setClientEmail(selected?.email || "");
      setClientName(selected?.name || "");
    },
    [clientOptions]
  );

  const handleBranchChange = useCallback((val: string) => {
    setSelectedBranch(val);
    setSelectedStaff("");
    setSelectedService("");
  }, []);

  const handleStaffChange = useCallback((val: string) => {
    setSelectedStaff(val);
  }, []);

  const handleServiceChange = useCallback((val: string) => {
    setSelectedService(val);
  }, []);

  const handleDateTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateTime(e.target.value);
    },
    []
  );

  if (branchesLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
          Loading branches...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="form"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={() => setformbtn(false)}
            className="sticky top-0 float-right p-1 hover:bg-gray-50 rounded-full transition-colors z-20"
            type="button"
          >
            <FiX className="text-gray-500 text-lg" />
          </button>

          <motion.h2
            variants={itemVariants}
            className="text-xl font-bold text-gray-800 mb-6 flex items-center"
          >
            <FiCalendar className="mr-2 text-blue-500" />
            New Appointment
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <AutocompleteField
                  label="Branch"
                  icon={<FiArrowRight className="w-4 h-4" />}
                  options={
                    salonData?.branches.map(
                      (b: Branchapiresponse) => b.branch_name
                    ) || []
                  }
                  value={selectedBranch}
                  setValue={handleBranchChange}
                  error={!!errors.branch}
                  required
                />

                <AutocompleteField
                  label="Staff"
                  icon={<FiUser className="w-4 h-4" />}
                  options={staffOptions}
                  value={selectedStaff}
                  setValue={handleStaffChange}
                  error={!!errors.staff}
                  required
                  disabled={!selectedBranch}
                />
              </div>

              <div className="space-y-4">
                <AutocompleteField
                  label="Service"
                  icon={<FiPlusCircle className="w-4 h-4" />}
                  options={serviceOptions}
                  value={selectedService}
                  setValue={handleServiceChange}
                  error={!!errors.service}
                  required
                  disabled={!selectedBranch}
                />

                <div className="relative">
                  <AutocompleteField
                    label="Client"
                    icon={<FiUser className="w-4 h-4" />}
                    options={clientOptions.map((o) => o.label)}
                    value={
                      clientOptions.find((o) => o.id === selectedClient)
                        ?.label || ""
                    }
                    setValue={handleClientChange}
                    error={!!errors.client}
                    required
                    disabled={false}
                  />
                  <motion.a
                    href={`/${userId}/dashboard/Clients`}
                    whileHover={{ x: 5 }}
                    className="absolute right-0 -top-1 flex items-center text-blue-500 text-xs font-medium"
                  >
                    New Client?
                    <FiArrowRight className="ml-1" />
                  </motion.a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                  <FiClock className="w-4 h-4 mr-2" />
                  Date & Time*
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={handleDateTimeChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.datetime ? "border-red-400" : "border-gray-200"
                    } focus:ring-2 ${
                      errors.datetime
                        ? "focus:ring-red-200"
                        : "focus:ring-blue-200"
                    } focus:border-transparent bg-white transition-all`}
                  />
                  <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.datetime && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center mt-1 text-red-500 text-xs"
                  >
                    <FiAlertCircle className="mr-1" />
                    Please select date and time
                  </motion.div>
                )}
              </div>
            </div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </div>
                ) : (
                  "Confirm Appointment"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default memo(AppointmentManagementForm);
