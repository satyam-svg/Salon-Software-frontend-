 'use client';
 
 import { motion, AnimatePresence } from 'framer-motion';
 import { useState, useEffect } from 'react';
 import { useForm } from 'react-hook-form';
 import { usePathname } from 'next/navigation';
 import {
   FiPackage,
   FiMapPin,
   FiClock,
   FiShoppingBag,
   FiChevronLeft,
   FiChevronRight,
   FiX,
   FiDollarSign,
   FiBox,
   FiWatch
 } from 'react-icons/fi';
 
 interface Branch {
   id: string;
   name: string;
   location: string;
   openingTime: string;
   closingTime: string;
   email: string;
   contact: string;
 }
 
 interface ProductFormData {
   productName: string;
   quantity: number;
   price: number;
 }
 
 interface ServiceFormData {
   serviceName: string;
   price: number;
   duration: string;
 }
 
 interface InventoryModalState {
   isOpen: boolean;
   type: 'product' | 'service' | null;
   branch: Branch | null;
 }
 
 export default function StepFour({ setStep }: { setStep: (step: number) => void }) {
   const pathname = usePathname();
   const userId = pathname.split('/')[1];
   const [salonId, setSalonId] = useState<string>('');
   const [branches, setBranches] = useState<Branch[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [modalState, setModalState] = useState<InventoryModalState>({
     isOpen: false,
     type: null,
     branch: null
   });
 
   const { 
     register: productRegister, 
     handleSubmit: handleProductSubmit, 
     reset: resetProduct,
     formState: { errors: productErrors }
   } = useForm<ProductFormData>();
 
   const { 
     register: serviceRegister, 
     handleSubmit: handleServiceSubmit, 
     reset: resetService,
     formState: { errors: serviceErrors }
   } = useForm<ServiceFormData>();
 
   useEffect(() => {
     const fetchBranches = async () => {
       try {
         const userResponse = await fetch(`https://salon-backend-3.onrender.com/api/users/${userId}`);
         if (!userResponse.ok) throw new Error('Failed to fetch user data');
         const userData = await userResponse.json();
         
         if (!userData.user?.salonId) throw new Error('Salon not found');
         setSalonId(userData.user.salonId);
 
         const branchResponse = await fetch('https://salon-backend-3.onrender.com/api/branch/isbranch', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ salon_id: userData.user.salonId })
         });
         
         const branchData = await branchResponse.json();
         if (branchData.isbranch) {
           setBranches(branchData.brances.map((branch: any) => ({
             id: branch.id,
             name: branch.branch_name,
             location: branch.branch_location,
             openingTime: branch.opning_time,
             closingTime: branch.closeings_time,
             email: branch.contact_email,
             contact: branch.contact_number
           })));
         }
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to load branches');
       } finally {
         setLoading(false);
       }
     };
 
     if (userId) fetchBranches();
   }, [userId]);
 
   const handleInventoryClick = (type: 'product' | 'service', branch: Branch) => {
     setModalState({ isOpen: true, type, branch });
   };
 
   const closeModal = () => {
     setModalState({ isOpen: false, type: null, branch: null });
     resetProduct();
     resetService();
   };
 
   const saveProduct = async (data: ProductFormData) => {
     try {
       // Replace with your actual product API endpoint
       const response = await fetch('https://salon-backend-3.onrender.com/api/products/add', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           ...data,
           branchId: modalState.branch?.id
         })
       });
 
       if (!response.ok) throw new Error('Failed to save product');
       closeModal();
     } catch (error) {
       console.error('Save product error:', error);
     }
   };
 
   const saveService = async (data: ServiceFormData) => {
     try {
       // Replace with your actual service API endpoint
       const response = await fetch('https://salon-backend-3.onrender.com/api/services/add', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           ...data,
           branchId: modalState.branch?.id
         })
       });
 
       if (!response.ok) throw new Error('Failed to save service');
       closeModal();
     } catch (error) {
       console.error('Save service error:', error);
     }
   };
 
   if (loading) return (
     <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="text-gray-500 dark:text-gray-300"
       >
         Loading branches...
       </motion.div>
     </div>
   );
 
   if (error) return (
     <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-rose-500">
       {error}
     </div>
   );
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
     >
       <div className="text-center mb-12">
         <motion.h2
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-4"
         >
           Manage Inventory
         </motion.h2>
         <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="text-gray-500 dark:text-gray-300 text-lg"
         >
           Add products and services to each branch
         </motion.p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {branches.map((branch) => (
           <motion.div
             key={branch.id}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             className="relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
           >
             <div className="p-6">
               <div className="mb-4">
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
                   {branch.name}
                 </h3>
                 <div className="space-y-2 text-sm text-gray-600">
                   <div className="flex items-center gap-2">
                     <FiMapPin className="text-rose-400" />
                     <span className="truncate">{branch.location}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <FiClock className="text-emerald-400" />
                     <span>{branch.openingTime} - {branch.closingTime}</span>
                   </div>
                 </div>
               </div>
 
               <div className="space-y-3">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleInventoryClick('product', branch)}
                   className="w-full bg-rose-50 text-rose-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                 >
                   <FiPackage className="text-lg" />
                   Add Products
                 </motion.button>
 
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleInventoryClick('service', branch)}
                   className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                 >
                   <FiShoppingBag className="text-lg" />
                   Add Services
                 </motion.button>
               </div>
             </div>
           </motion.div>
         ))}
       </div>
 
       <AnimatePresence>
   {modalState.isOpen && (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 flex items-center justify-center p-4 z-50"
       onClick={closeModal}
     >
       <motion.div
         initial={{ y: 20 }}
         animate={{ y: 0 }}
         exit={{ y: -20 }}
         className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl"
         onClick={(e) => e.stopPropagation()}
       >
               <button
                 onClick={closeModal}
                 className="absolute top-4 right-4 text-gray-400 hover:text-rose-500"
               >
                 <FiX className="text-xl" />
               </button>
 
               <h3 className="text-xl font-semibold mb-6">
                 Add {modalState.type === 'product' ? 'Product' : 'Service'} to{' '}
                 <span className="text-rose-500">{modalState.branch?.name}</span>
               </h3>
 
               {modalState.type === 'product' ? (
                 <form onSubmit={handleProductSubmit(saveProduct)} className="space-y-4">
                   <div className="relative">
                     <input
                       {...productRegister('productName', { required: 'Product name is required' })}
                       placeholder="Product Name"
                       className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                     />
                     <FiBox className="absolute right-3 top-3.5 text-gray-400" />
                   </div>
                   {productErrors.productName && <p className="text-rose-500 text-sm">{productErrors.productName.message}</p>}
 
                   <div className="grid grid-cols-2 gap-4">
                     <div className="relative">
                       <input
                         type="number"
                         {...productRegister('quantity', { 
                           required: 'Quantity is required',
                           min: { value: 1, message: 'Minimum quantity is 1' }
                         })}
                         placeholder="Quantity"
                         className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                       />
                       <FiPackage className="absolute right-3 top-3.5 text-gray-400" />
                     </div>
                     {productErrors.quantity && <p className="text-rose-500 text-sm">{productErrors.quantity.message}</p>}
 
                     <div className="relative">
                       <input
                         type="number"
                         step="0.01"
                         {...productRegister('price', { 
                           required: 'Price is required',
                           min: { value: 0, message: 'Price must be positive' }
                         })}
                         placeholder="Price"
                         className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                       />
                       <FiDollarSign className="absolute right-3 top-3.5 text-gray-400" />
                     </div>
                     {productErrors.price && <p className="text-rose-500 text-sm">{productErrors.price.message}</p>}
                   </div>
 
                   <div className="flex gap-3 mt-6">
                   <button
           onClick={closeModal}
           className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"
         >
           <FiX className="text-xl" />
         </button>
                     <button
                       type="submit"
                       className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:shadow-lg"
                     >
                       Save Product
                     </button>
                   </div>
                 </form>
               ) : (
                 <form onSubmit={handleServiceSubmit(saveService)} className="space-y-4">
                   <div className="relative">
                     <input
                       {...serviceRegister('serviceName', { required: 'Service name is required' })}
                       placeholder="Service Name"
                       className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                     />
                     <FiShoppingBag className="absolute right-3 top-3.5 text-gray-400" />
                   </div>
                   {serviceErrors.serviceName && <p className="text-rose-500 text-sm">{serviceErrors.serviceName.message}</p>}
 
                   <div className="grid grid-cols-2 gap-4">
                     <div className="relative">
                       <input
                         type="number"
                         step="0.01"
                         {...serviceRegister('price', { 
                           required: 'Price is required',
                           min: { value: 0, message: 'Price must be positive' }
                         })}
                         placeholder="Price"
                         className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                       />
                       <FiDollarSign className="absolute right-3 top-3.5 text-gray-400" />
                     </div>
                     {serviceErrors.price && <p className="text-rose-500 text-sm">{serviceErrors.price.message}</p>}
 
                     <div className="relative">
                       <input
                         type="time"
                         {...serviceRegister('duration', { required: 'Duration is required' })}
                         className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:ring-0"
                       />
                       <FiWatch className="absolute right-3 top-3.5 text-gray-400" />
                     </div>
                     {serviceErrors.duration && <p className="text-rose-500 text-sm">{serviceErrors.duration.message}</p>}
                   </div>
 
                   <div className="flex gap-3 mt-6">
                     <button
                       type="button"
                       onClick={closeModal}
                       className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:shadow-lg"
                     >
                       Save Service
                     </button>
                   </div>
                 </form>
               )}
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
 
       <motion.div
         className="mt-12 flex justify-between items-center"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
       >
         <motion.button
           onClick={() => setStep(2)}
           whileHover={{ x: -5 }}
           className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
         >
           <FiChevronLeft />
           Previous Step
         </motion.button>
 
         <motion.button
           onClick={() => setStep(4)}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
         >
           Save & Next
           <FiChevronRight className="inline-block ml-2" />
         </motion.button>
       </motion.div>
     </motion.div>
   );
 }
 
 
 