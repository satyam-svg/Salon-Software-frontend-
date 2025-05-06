"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiPlus, FiEdit, FiTrash, FiCheck, FiX,
  FiCalendar, FiDollarSign, FiUsers, FiBox,
  FiGitBranch, FiClipboard, FiStar
} from 'react-icons/fi';

interface Feature {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  branchLimit: number;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PackageManagement = () => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const allFeatures: Feature[] = [
    { id: 'appointments', name: 'Appointments', icon: <FiCalendar /> },
    { id: 'finance', name: 'Finance', icon: <FiDollarSign /> },
    { id: 'clients', name: 'Clients', icon: <FiUsers /> },
    { id: 'inventory', name: 'Inventory', icon: <FiBox /> },
    { id: 'branch', name: 'Branch', icon: <FiGitBranch /> },
    { id: 'services', name: 'Services', icon: <FiClipboard /> },
    { id: 'feedback', name: 'Feedback', icon: <FiStar /> },
    { id: 'staff', name: 'Staff', icon: <FiUsers /> },
  ];

  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    branchLimit: 1,
    features: [] as string[],
    isUnlimitedBranches: false,
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/getall`);
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        branchLimit: formData.isUnlimitedBranches ? 9999 : formData.branchLimit
      };

      if (editingPackage) {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/update/${editingPackage.id}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/add`, payload);
      }

      await fetchPackages();
      setShowModal(false);
      setFormData(initialFormState);
      setEditingPackage(null);
    } catch (err) {
      setError(editingPackage ? 'Failed to update package' : 'Failed to create package');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: SubscriptionPackage) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      branchLimit: pkg.branchLimit === 9999 ? 1 : pkg.branchLimit,
      features: pkg.features,
      isUnlimitedBranches: pkg.branchLimit === 9999,
    });
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/packages/delete/${id}`);
      await fetchPackages();
    } catch (err) {
      setError('Failed to delete package');
      console.log(err)

    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatBranchLimit = (limit: number) => {
    return limit === 9999 ? 'Unlimited' : limit;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:bg-gray-400"
          disabled={loading}
        >
          <FiPlus /> Create Package
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                  <p className="text-purple-600 text-lg font-medium">
                    {formatPrice(pkg.price)}/month
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-gray-500 hover:text-purple-600 p-2"
                    disabled={loading}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-gray-500 hover:text-red-600 p-2"
                    disabled={loading}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FiGitBranch />
                  <span>Branch Limit: {formatBranchLimit(pkg.branchLimit)}</span>
                </div>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Included Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {allFeatures.map(feature => (
                    pkg.features.includes(feature.id) && (
                      <div key={feature.id} className="flex items-center gap-2 text-sm text-gray-600">
                        {feature.icon}
                        <span>{feature.name}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData(initialFormState);
                  setEditingPackage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Package Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full p-2 border rounded-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Branch Limit</label>
                  <div className="flex gap-4">
                    <select
                      className="flex-1 p-2 border rounded-lg"
                      value={formData.isUnlimitedBranches ? 'unlimited' : 'limited'}
                      onChange={(e) => setFormData({
                        ...formData,
                        isUnlimitedBranches: e.target.value === 'unlimited',
                        branchLimit: e.target.value === 'unlimited' ? 1 : formData.branchLimit
                      })}
                      disabled={loading}
                    >
                      <option value="limited">Limited</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                    {!formData.isUnlimitedBranches && (
                      <input
                        type="number"
                        min="1"
                        required
                        className="w-24 p-2 border rounded-lg"
                        value={formData.branchLimit}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          branchLimit: Number(e.target.value) 
                        })}
                        disabled={loading}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Select Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allFeatures.map(feature => (
                    <label
                      key={feature.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                        formData.features.includes(feature.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-400'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.features.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
                        disabled={loading}
                      />
                      {feature.icon}
                      <span className="text-sm">{feature.name}</span>
                      {formData.features.includes(feature.id) && (
                        <FiCheck className="ml-auto text-purple-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData(initialFormState);
                    setEditingPackage(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagement;