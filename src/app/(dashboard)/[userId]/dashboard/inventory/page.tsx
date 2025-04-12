// app/dashboard/inventory/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiEdit, FiTrash, FiPlus, FiChevronDown, FiSearch, FiCalendar, FiDollarSign, FiBox } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  branch: string;
  quantity: number;
  price: number;
}

interface UsedProduct {
  id: string;
  productName: string;
  branch: string;
  quantityUsed: number;
  dateUsed: string;
  usedBy: string;
  service: string;
}

const InventoryPage = () => {
  const [branches] = useState(['Downtown Branch', 'Uptown Branch', 'Westside Branch', 'Eastside Branch']);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Enhanced Dummy Product Data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Shampoo',
      branch: 'Downtown Branch',
      quantity: 15,
      price: 32.99,
    },
    {
      id: '2',
      name: 'Hair Color Kit',
      branch: 'Downtown Branch',
      quantity: 8,
      price: 45.50,
    },
    {
      id: '3',
      name: 'Conditioner Pro',
      branch: 'Uptown Branch',
      quantity: 12,
      price: 28.75,
    },
    {
      id: '4',
      name: 'Styling Gel',
      branch: 'Westside Branch',
      quantity: 20,
      price: 18.99,
    },
    {
      id: '5',
      name: 'Scalp Treatment',
      branch: 'Eastside Branch',
      quantity: 6,
      price: 55.00,
    }
  ]);

  // Enhanced Used Product Data
  const [usedProducts] = useState<UsedProduct[]>([
    {
      id: 'u1',
      productName: 'Premium Shampoo',
      branch: 'Downtown Branch',
      quantityUsed: 2,
      dateUsed: '2024-03-15',
      usedBy: 'John Doe',
      service: 'Hair Wash'
    },
    {
      id: 'u2',
      productName: 'Hair Color Kit',
      branch: 'Downtown Branch',
      quantityUsed: 1,
      dateUsed: '2024-03-15',
      usedBy: 'Jane Smith',
      service: 'Color Treatment'
    },
    {
      id: 'u3',
      productName: 'Conditioner Pro',
      branch: 'Uptown Branch',
      quantityUsed: 3,
      dateUsed: '2024-03-14',
      usedBy: 'Mike Johnson',
      service: 'Hair Treatment'
    },
    {
      id: 'u4',
      productName: 'Styling Gel',
      branch: 'Westside Branch',
      quantityUsed: 1,
      dateUsed: '2024-03-14',
      usedBy: 'Sarah Wilson',
      service: 'Styling Service'
    }
  ]);


  // Filtered Products
  const filteredProducts = products.filter(product => 
    product.branch === selectedBranch &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Used Products
  const filteredUsedProducts = usedProducts.filter(product => 
    product.branch === selectedBranch &&
    (selectedDate ? product.dateUsed === selectedDate : true)
  );
  // Statistics Calculations
  const totalProducts = filteredProducts.length;
  const totalValue = filteredProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const usedItemsCost = filteredUsedProducts.reduce((sum, usedProduct) => {
    // Find the corresponding product in the products array
    const product = products.find(p => 
      p.name === usedProduct.productName && 
      p.branch === usedProduct.branch
    );
    
    // Calculate cost for this used product (quantity used * price)
    return sum + (product ? usedProduct.quantityUsed * product.price : 0);
  }, 0);

  // Form Handling
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...editingProduct, ...formData } : p
      ));
    } else {
      setProducts([...products, {
        ...formData,
        id: Math.random().toString(),
        branch: selectedBranch
      }]);
    }
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', quantity: 0, price: 0 });
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mb-14">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full pl-4 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl appearance-none focus:border-purple-500 focus:ring-0"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-4 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiPlus className="text-lg" />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiBox className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiDollarSign className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
  className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500"
  whileHover={{ y: -2 }}
>
  <div className="flex items-center gap-4">
    <div className="p-3 bg-green-100 rounded-xl">
      <FiDollarSign className="text-2xl text-green-600" />
    </div>
    <div>
      <p className="text-gray-500">Used Items Cost</p>
      <p className="text-2xl font-bold">
        ${usedItemsCost.toLocaleString(undefined, { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })}
      </p>
    </div>
  </div>
</motion.div>
      </div>

      {/* All Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Product Management - All Products</h2>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl max-w-md w-full">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr 
                  key={product.id} 
                  className="border-t border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => handleEdit(product)}
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setShowDeleteConfirm(product.id)}
                    >
                      <FiTrash />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Used Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold">Used Product History</h2>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
              <FiCalendar className="text-gray-400" />
              <input
                type="date"
                className="bg-transparent focus:outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Quantity Used</th>
                <th className="p-4 text-left">Date Used</th>
                <th className="p-4 text-left">Used By</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsedProducts.map(product => (
                <tr 
                  key={product.id} 
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{product.productName}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {product.service}
                    </span>
                  </td>
                  <td className="p-4">{product.quantityUsed}</td>
                  <td className="p-4">{new Date(product.dateUsed).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {product.usedBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

               

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.quantity || ''}
                      onChange={(e) => setFormData({ ...formData, quantity: +e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({ name: '', quantity: 0, price: 0});
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-2xl font-semibold mb-6">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteProduct(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryPage;