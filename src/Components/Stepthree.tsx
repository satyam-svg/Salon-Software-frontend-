import { useState } from "react";
import { FaPlus } from "react-icons/fa";
interface StaffMember {
    fullname: string;
    email: string;
    contact: string;
    password: string;
    profile_img: string;
    staff_id: string;
  }
  interface FormData {
    staff: StaffMember;
  }
export default function StepThree({ step }: { step: number }) {
    const [formData, setFormData] = useState<FormData>({

        staff: {
          fullname: '',
          email: '',
          contact: '',
          password: '',
          profile_img: '',
          staff_id: ''
        },
      });
      const [staff, setStaff] = useState<StaffMember[]>([]);
      const [showStaffForm, setShowStaffForm] = useState(false);
  return (
    <>
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#b76e79] mb-8">
            Add Staff Members
          </h2>

          {staff.map((staffMember, index) => (
            <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#b76e79]">
                  {staffMember.fullname}
                </h3>
                <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                  Added
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {staffMember.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Contact:</span>{" "}
                    {staffMember.contact}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Staff ID:</span>{" "}
                    {staffMember.staff_id}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(showStaffForm || staff.length === 0) && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.staff.fullname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: {
                            ...formData.staff,
                            fullname: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.staff.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: { ...formData.staff, email: e.target.value },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.staff.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: {
                            ...formData.staff,
                            password: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.staff.contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: { ...formData.staff, contact: e.target.value },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Staff ID *
                    </label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.staff.staff_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: {
                            ...formData.staff,
                            staff_id: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              staff: {
                                ...formData.staff,
                                profile_img: reader.result as string,
                              },
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  if (
                    formData.staff.fullname &&
                    formData.staff.email &&
                    formData.staff.contact &&
                    formData.staff.password
                  ) {
                    setStaff([...staff, formData.staff]);
                    setFormData({
                      ...formData,
                      staff: {
                        fullname: "",
                        email: "",
                        contact: "",
                        password: "",
                        profile_img: "",
                        staff_id: "",
                      },
                    });
                    setShowStaffForm(false);
                  }
                }}
              >
                <FaPlus /> Add Staff
              </button>
            </div>
          )}

          {!showStaffForm && staff.length > 0 && (
            <button
              className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowStaffForm(true)}
            >
              <FaPlus /> Add Another Staff Member
            </button>
          )}
        </div>
      )}
    </>
  );
}
