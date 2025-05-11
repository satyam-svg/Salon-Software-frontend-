"use client";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

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
  const [, setImageLoading] = useState(true);
  const [totalclients, settotalclient] = useState(0);
  const [totalstaff, settotalstaff] = useState(0);
  const [totalservice, settotalservice] = useState(0);
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
    getsalon();
  }, [salonid]);

  useEffect(() => {
    if (salon.salon_img_url) setImageLoading(true);
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 grid gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {salon.salon_img_url && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={salon.salon_img_url}
                  alt={salon.salon_name}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-100"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {salon.salon_name}
              </h1>
              <p className="text-gray-500">{salon.salon_tag}</p>
            </div>
          </div>
          <button
            onClick={handleDashboardClick}
            disabled={isNavigating}
            className={`px-6 py-3 rounded-lg font-medium ${
              isNavigating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            {isNavigating ? "Loading..." : "Manage Dashboard"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { value: yearsOperating, label: "Years Operating", color: "blue" },
            { value: totalclients, label: "Total Clients", color: "blue" },
            { value: totalstaff, label: "Staff Members", color: "blue" },
            { value: totalservice, label: "Services Offered", color: "blue" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Salon Details Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{salon.contact_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{salon.contact_number}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Share Salon Link</h2>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-600">
                    {salon.share_link}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    {copySuccess ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
              <button className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Operating Since</label>
              <p className="font-medium">
                {new Date(salon.opening_time).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Total Days Active</label>
              <p className="font-medium">{daysOperating} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHomepage;
