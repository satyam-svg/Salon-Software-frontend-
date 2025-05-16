"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiScissors,
  FiImage,
  FiSave,
} from "react-icons/fi";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useScreenLoader } from "@/context/screenloader";
import Screenloader from "@/Components/Screenloader";
import toast from "react-hot-toast";
import { useButtonLoader } from "@/context/buttonloader";

interface UserDetails {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  profile_img: string;
  salonId: string;
}

interface SalonDetails {
  id: string;
  salonName: string;
  salonTag: string;
  salonImgUrl: string;
  contactEmail: string;
  contactNumber: string;
}

const GeneralSettingsPage = () => {
  const pathname = usePathname();
  const userId = pathname.split("/")[1];
  const { ScreenLoaderToggle, setScreenLoaderToggle } = useScreenLoader();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { ButtonLoaderToggle, setButtonLoaderToggle } = useButtonLoader();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    id: "",
    fullname: "",
    email: "",
    contact: "",
    profile_img: "",
    salonId: "",
  });

  const [salonDetails, setSalonDetails] = useState<SalonDetails>({
    id: "",
    salonName: "",
    salonTag: "",
    salonImgUrl: "",
    contactEmail: "",
    contactNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setScreenLoaderToggle(true);
        setError("");

        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`
        );

        if (!userResponse.data?.user) {
          throw new Error("User data not found");
        }

        const userData = userResponse.data.user;
        setUserDetails(userData);

        if (userData.salonId) {
          const salonResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/salon/getsalonbyid`,
            { id: userData.salonId }
          );

          if (!salonResponse.data?.salon) {
            throw new Error("Salon data not found");
          }

          const salonData = salonResponse.data.salon;
          setSalonDetails({
            id: salonData.id,
            salonName: salonData.salon_name,
            salonTag: salonData.salon_tag,
            salonImgUrl: salonData.salon_img_url,
            contactEmail: salonData.contact_email,
            contactNumber: salonData.contact_number,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data. Please try again later.");
        toast.error("Data loading failed!");
      } finally {
        setScreenLoaderToggle(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError("User ID not available");
    }
  }, [userId, setScreenLoaderToggle]);

  const handleImageUpload = async (file: File, type: "owner" | "salon") => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "salon_preset");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dl1lqotns/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();

      if (type === "owner") {
        setUserDetails((prev) => ({ ...prev, profile_img: data.secure_url }));
      } else {
        setSalonDetails((prev) => ({ ...prev, salonImgUrl: data.secure_url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSalonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalonDetails({ ...salonDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "owner" | "salon"
  ) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0], type);
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: "owner" | "salon") => {
    e.preventDefault();
    try {
      setButtonLoaderToggle(true);
      if (type === "owner") {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`,
          userDetails
        );

        toast.success("Owner details updated successfully!");
      } else {
        const salonPayload = {
          id: salonDetails.id,
          salon_name: salonDetails.salonName,
          salon_tag: salonDetails.salonTag,
          salon_img_url: salonDetails.salonImgUrl,
          contact_email: salonDetails.contactEmail,
          contact_number: salonDetails.contactNumber,
        };

        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/salon/updatesalon`,
          salonPayload
        );
        toast.success("Salon details updated successfully!");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Error saving changes!");
    } finally {
      setButtonLoaderToggle(false);
    }
  };

  if (ScreenLoaderToggle) return <Screenloader />;
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-red-500">{error}</div>
    );

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Owner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FiUser className="text-purple-600" />
            Owner Details
          </h2>

          <form
            onSubmit={(e) => handleSubmit(e, "owner")}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiUser className="text-gray-400" />
                  <input
                    type="text"
                    name="fullname"
                    value={userDetails.fullname}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiMail className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Contact
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiPhone className="text-gray-400" />
                  <input
                    type="tel"
                    name="contact"
                    value={userDetails.contact}
                    onChange={handleOwnerChange}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Profile Image
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <FiImage className="text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "owner")}
                    className="w-full bg-transparent focus:outline-none"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>

            {userDetails.profile_img && (
              <div className="mt-4">
                <img
                  src={userDetails.profile_img}
                  alt="Owner"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                />
              </div>
            )}

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                type="submit"
                disabled={uploading}
              >
                <FiSave />
                {uploading
                  ? "Uploading..."
                  : !ButtonLoaderToggle
                  ? "Update Owner"
                  : "Updating Owner..."}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Salon Section */}
        {salonDetails.id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FiScissors className="text-purple-600" />
              Salon Details
            </h2>

            <form
              onSubmit={(e) => handleSubmit(e, "salon")}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Salon Name
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      name="salonName"
                      value={salonDetails.salonName}
                      onChange={handleSalonChange}
                      className="w-full bg-transparent focus:outline-none"
                      placeholder="Enter salon name"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Tagline
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      name="salonTag"
                      value={salonDetails.salonTag}
                      onChange={handleSalonChange}
                      className="w-full bg-transparent focus:outline-none"
                      placeholder="Enter salon tagline"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Contact Email
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <FiMail className="text-gray-400" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={salonDetails.contactEmail}
                      onChange={handleSalonChange}
                      className="w-full bg-transparent focus:outline-none"
                      placeholder="Enter salon email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <FiPhone className="text-gray-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={salonDetails.contactNumber}
                      onChange={handleSalonChange}
                      className="w-full bg-transparent focus:outline-none"
                      placeholder="Enter salon contact number"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Salon Image
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <FiImage className="text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "salon")}
                      className="w-full bg-transparent focus:outline-none"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {salonDetails.salonImgUrl && (
                <div className="mt-4">
                  <img
                    src={salonDetails.salonImgUrl}
                    alt="Salon"
                    className="w-full max-w-md rounded-xl object-cover h-48 border-4 border-purple-100"
                  />
                </div>
              )}

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                  type="submit"
                  disabled={uploading}
                >
                  <FiSave />
                  {uploading
                    ? "Uploading..."
                    : !ButtonLoaderToggle
                    ? "Update Salon"
                    : "Updating Salon....."}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
