import { useState } from "react";
import { FaPlus } from "react-icons/fa";
interface Product {
  product_name: string;
  product_quantity: number;
  price: number;
}

interface FormData {
  product: Product;
}
export default function StepFour({ step }: { step: number }){
    const [formData, setFormData] = useState<FormData>({
        product: {
          product_name: '',
          product_quantity: 0,
          price: 0
        }
      });
      const [inventory, setInventory] = useState<Product[]>([]);
      const [showInventoryForm, setShowInventoryForm] = useState(false);
    return (
        <>
          {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#b76e79] mb-8">Manage Inventory</h2>
                
                {inventory.map((item, index) => (
                  <div key={index} className="bg-[#fff9f7] p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#b76e79]">{item.product_name}</h3>
                      <span className="bg-[#e8c4c0] text-[#b76e79] px-3 py-1 rounded-full text-sm">
                        {item.product_quantity} in stock
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Price:</span> ${item.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Value:</span> ${item.price * item.product_quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {(showInventoryForm || inventory.length === 0) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Product Name *</label>
                        <input
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.product_name}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, product_name: e.target.value}})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Quantity *</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.product_quantity}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, product_quantity: parseInt(e.target.value) || 0}})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-[#e8c4c0] rounded-lg"
                          value={formData.product.price}
                          onChange={(e) => setFormData({...formData, product: {...formData.product, price: parseFloat(e.target.value) || 0}})}
                          required
                        />
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#b76e79] text-white py-4 rounded-xl font-semibold hover:bg-[#a55d68] transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        if (formData.product.product_name && 
                            formData.product.product_quantity && 
                            formData.product.price) {
                          setInventory([...inventory, formData.product]);
                          setFormData({...formData, product: {
                            product_name: '',
                            product_quantity: 0,
                            price: 0
                          }});
                          setShowInventoryForm(false);
                        }
                      }}
                    >
                      <FaPlus /> Add Product
                    </button>
                  </div>
                )}

                {!showInventoryForm && inventory.length > 0 && (
                  <button
                    className="w-full border-2 border-dashed border-[#e8c4c0] text-[#b76e79] py-4 rounded-xl font-semibold hover:border-[#b76e79] transition-colors flex items-center justify-center gap-2"
                    onClick={() => setShowInventoryForm(true)}
                  >
                    <FaPlus /> Add Another Product
                  </button>
                )}
              </div>
            )}
        </>
    )
}