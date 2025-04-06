import { useState } from "react";
interface Branch {
    branch_name: string;
    branch_location: string;
    contact_email: string;
    contact_number: string;
    opening_time: string;
    closing_time: string;
  }
  interface StaffMember {
    fullname: string;
    email: string;
    contact: string;
    password: string;
    profile_img: string;
    staff_id: string;
  }
  interface Product {
    product_name: string;
    product_quantity: number;
    price: number;
  }
  interface FormData {
    salon_name: string;
    salon_tag: string;
    opening_time: string;
    contact_email: string;
    contact_number: string;
    branch_url: string;
    salon_img_url: string;
    branch: Branch;
    staff: StaffMember;
    product: Product;
  }
  
export default function StepFive({ step }: { step: number }){
    const [branches] = useState<Branch[]>([]);
    const [staff] = useState<StaffMember[]>([]);
    const [inventory] = useState<Product[]>([]);
    const [formData] = useState<FormData>({
        salon_name: '',
        salon_tag: '',
        opening_time: '',
        contact_email: '',
        contact_number: '',
        branch_url: '',
        salon_img_url: '',
        branch: {
          branch_name: '',
          branch_location: '',
          contact_email: '',
          contact_number: '',
          opening_time: '',
          closing_time: ''
        },
        staff: {
          fullname: '',
          email: '',
          contact: '',
          password: '',
          profile_img: '',
          staff_id: ''
        },
        product: {
          product_name: '',
          product_quantity: 0,
          price: 0
        }
      });
    
    return <>
                    {step === 5 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Review Your Salon Setup</h2>
                
                <div className="bg-[#fff9f7] p-8 rounded-xl">
                  <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Salon Details</h3>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Salon Name:</span> {formData.salon_name}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Tagline:</span> {formData.salon_tag}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Established:</span> {formData.opening_time || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Contact Email:</span> {formData.contact_email}</p>
                      <p className="text-gray-600 mb-2"><span className="font-medium text-gray-800">Contact Number:</span> {formData.contact_number}</p>
                    </div>
                  </div>

                  {branches.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Branches ({branches.length})</h3>
                      <div className="space-y-4 mb-8">
                        {branches.map((branch, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{branch.branch_name}</h4>
                            <p className="text-gray-600">{branch.branch_location}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {staff.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Staff Members ({staff.length})</h3>
                      <div className="space-y-4 mb-8">
                        {staff.map((staffMember, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{staffMember.fullname}</h4>
                            <p className="text-gray-600">{staffMember.email}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {inventory.length > 0 && (
                    <>
                      <h3 className="text-2xl font-semibold text-[#b76e79] mb-6">Inventory Items ({inventory.length})</h3>
                      <div className="space-y-4">
                        {inventory.map((item, index) => (
                          <div key={index} className="border-l-4 border-[#e8c4c0] pl-4 py-2">
                            <h4 className="font-medium text-gray-800">{item.product_name}</h4>
                            <p className="text-gray-600">{item.product_quantity} units at ${item.price} each</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
    </>
}