import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
interface FormData {
  salon_name: string;
  salon_tag: string;
  opening_time: string;
  contact_email: string;
  contact_number: string;
  branch_url: string;
  salon_img_url: string;
}
export default function StepOne({ step }: { step: number }) {
    const [formData, setFormData] = useState<FormData>({
        salon_name: '',
        salon_tag: '',
        opening_time: '',
        contact_email: '',
        contact_number: '',
        branch_url: '',
        salon_img_url: '',
      });
      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({...formData, salon_img_url: reader.result as string});
          };
          reader.readAsDataURL(file);
        }
      };
     return (
     <>
       {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Salon Information</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Salon Name *</label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
                      value={formData.salon_name}
                      onChange={(e) => setFormData({...formData, salon_name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Salon Tagline *</label>
                    <input
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
                      value={formData.salon_tag}
                      onChange={(e) => setFormData({...formData, salon_tag: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Contact Email *</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
                      value={formData.contact_number}
                      onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Establishment Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-[#e8c4c0] rounded-lg focus:ring-2 focus:ring-[#b76e79]"
                      value={formData.opening_time}
                      onChange={(e) => setFormData({...formData, opening_time: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">Salon Image</label>
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#e8c4c0] rounded-xl cursor-pointer hover:border-[#b76e79] transition-colors">
                      {formData.salon_img_url ? (
                        <img src={formData.salon_img_url} alt="Salon" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <>
                          <FaCloudUploadAlt className="text-3xl text-[#b76e79] mb-2" />
                          <p className="text-gray-500">Click to upload salon image</p>
                        </>
                      )}
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
            )}
     </>
     )
}