"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPlusCircle,
  FiArrowRight,
  FiClipboard,
  FiX,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";

const AppointmentManagementForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Dummy data
  const branches = ["Main Branch", "Downtown Branch", "Westside Branch"];
  const staffMembers = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sarah Wilson",
  ];
  const services = [
    "Haircut",
    "Coloring",
    "Spa Treatment",
    "Manicure",
    "Facial",
  ];
  const clients = [
    "Alice Thompson",
    "Bob Anderson",
    "Charlie Roberts",
    "Diana Miller",
  ];

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

  const AutocompleteField = ({
    label,
    icon,
    options,
    value,
    setValue,
    error,
    required,
  }: {
    label: string;
    icon: React.ReactNode;
    options: string[];
    value: string;
    setValue: (val: string) => void;
    error: boolean;
    required?: boolean;
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (value) setSearchQuery(value);
    }, [value]);

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div variants={itemVariants} className="relative mb-6">
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
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              className={`w-full pl-10 pr-8 py-3 rounded-xl border ${
                error ? "border-red-400" : "border-gray-200"
              } focus:ring-2 ${
                error ? "focus:ring-red-200" : "focus:ring-blue-200"
              } focus:border-transparent bg-white transition-all`}
              placeholder={`Select ${label.toLowerCase()}...`}
            />
            <div className="absolute left-3 text-gray-400">{icon}</div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setValue("");
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX />
              </button>
            )}
          </div>

          <AnimatePresence>
            {isOpen && filteredOptions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
              >
                {filteredOptions.map((option) => (
                  <motion.li
                    key={option}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
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
            className="flex items-center mt-2 text-red-500 text-sm"
          >
            <FiAlertCircle className="mr-1" />
            Please select a {label.toLowerCase()}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      branch: !selectedBranch,
      staff: !selectedStaff,
      service: !selectedService,
      client: !selectedClient,
      datetime: !dateTime,
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Form submitted");
      setIsFormOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
          >
            <FiPlus className="mr-2 text-lg" />
            Schedule Appointment
          </motion.button>
        ) : (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative w-full max-w-2xl"
          >
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <FiX className="text-gray-500 text-xl" />
            </button>

            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800 mb-8 flex items-center"
            >
              <FiCalendar className="mr-3 text-blue-500" />
              New Appointment
            </motion.h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <AutocompleteField
                    label="Branch"
                    icon={<FiArrowRight className="w-4 h-4" />}
                    options={branches}
                    value={selectedBranch}
                    setValue={setSelectedBranch}
                    error={errors.branch}
                    required
                  />

                  <AutocompleteField
                    label="Staff"
                    icon={<FiUser className="w-4 h-4" />}
                    options={staffMembers}
                    value={selectedStaff}
                    setValue={setSelectedStaff}
                    error={errors.staff}
                    required
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <AutocompleteField
                    label="Service"
                    icon={<FiPlusCircle className="w-4 h-4" />}
                    options={services}
                    value={selectedService}
                    setValue={setSelectedService}
                    error={errors.service}
                    required
                  />

                  <div className="relative">
                    <AutocompleteField
                      label="Client"
                      icon={<FiUser className="w-4 h-4" />}
                      options={clients}
                      value={selectedClient}
                      setValue={setSelectedClient}
                      error={errors.client}
                      required
                    />
                    <motion.a
                      href="/client-management"
                      whileHover={{ x: 5 }}
                      className="absolute right-0 -top-1 flex items-center text-blue-500 text-sm font-medium"
                    >
                      New Client?
                      <FiArrowRight className="ml-1" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Date/Time and Notes Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="relative">
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                    <FiClock className="w-4 h-4 mr-2" />
                    Date & Time*
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.datetime ? "border-red-400" : "border-gray-200"
                      } focus:ring-2 ${
                        errors.datetime
                          ? "focus:ring-red-200"
                          : "focus:ring-blue-200"
                      } focus:border-transparent bg-white transition-all`}
                    />
                    <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.datetime && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-2 text-red-500 text-sm"
                    >
                      <FiAlertCircle className="mr-1" />
                      Please select date and time
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
                    <FiClipboard className="w-4 h-4 mr-2" />
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all h-40"
                    placeholder="Special requests or notes..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="mt-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Confirm Appointment
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentManagementForm;
