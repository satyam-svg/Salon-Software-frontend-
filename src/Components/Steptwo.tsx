import { useState } from "react";
import { FaPlus } from "react-icons/fa";
interface Branch {
  branch_name: string;
  branch_location: string;
  contact_email: string;
  contact_number: string;
  opening_time: string;
  closing_time: string;
}
interface FormData {
  branch: Branch;
}
export default function StepTwo({ step }: { step: number }) {
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formData, setFormData] = useState<FormData>({
    branch: {
      branch_name: "",
      branch_location: "",
      contact_email: "",
      contact_number: "",
      opening_time: "",
      closing_time: "",
    },
  });
  return (
    <>
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#b76e79] mb-8">
            Add Branches
          </h2>

          {branches.map((branch, index) => (
            <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#b76e79]">
                  {branch.branch_name}
                </h3>
                <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                  Added
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {branch.branch_location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {branch.contact_email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Contact:</span>{" "}
                    {branch.contact_number}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Hours:</span>{" "}
                    {branch.opening_time} - {branch.closing_time}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(showBranchForm || branches.length === 0) && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Branch Name *
                    </label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.branch_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            branch_name: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.contact_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            contact_email: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Opening Time *
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.opening_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            opening_time: e.target.value,
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
                      Location *
                    </label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.branch_location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            branch_location: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            contact_number: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Closing Time *
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                      value={formData.branch.closing_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            closing_time: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  if (
                    formData.branch.branch_name &&
                    formData.branch.branch_location &&
                    formData.branch.contact_email &&
                    formData.branch.contact_number
                  ) {
                    setBranches([...branches, formData.branch]);
                    setFormData({
                      ...formData,
                      branch: {
                        branch_name: "",
                        branch_location: "",
                        contact_email: "",
                        contact_number: "",
                        opening_time: "",
                        closing_time: "",
                      },
                    });
                    setShowBranchForm(false);
                  }
                }}
              >
                <FaPlus /> Add Branch
              </button>
            </div>
          )}

          {!showBranchForm && branches.length > 0 && (
            <button
              className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowBranchForm(true)}
            >
              <FaPlus /> Add Another Branch
            </button>
          )}
        </div>
      )}
    </>
  );
}
