"use client";
import { useState, useEffect } from 'react';
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

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  branchLimit: number | string;
  features: string[];
}

const PackageManagement = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    price: '',
    branchLimit: '1',
    features: [] as string[],
    isUnlimitedBranches: false,
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

  useEffect(() => {
    setPackages([
      {
        id: 1,
        name: 'Basic',
        price: '₹999/month',
        branchLimit: 1,
        features: ['appointments', 'finance', 'clients'],
        description: 'Essential features for small businesses'
      },
      {
        id: 2,
        name: 'Standard',
        price: '₹1999/month',
        branchLimit: 5,
        features: ['appointments', 'finance', 'clients', 'inventory', 'feedback'],
        description: 'Advanced features for growing businesses'
      },
      {
        id: 3,
        name: 'Premium',
        price: '₹2999/month',
        branchLimit: 'Unlimited',
        features: allFeatures.map(f => f.id),
        description: 'Complete solution for large enterprises'
      }
    ]);
  }, []);

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPackage: Package = {
      id: editingPackage?.id || Date.now(),
      ...formData,
      branchLimit: formData.isUnlimitedBranches ? 'Unlimited' : parseInt(formData.branchLimit)
    };

    setPackages(prev =>
      editingPackage
        ? prev.map(p => p.id === editingPackage.id ? newPackage : p)
        : [...prev, newPackage]
    );

    setShowModal(false);
    setFormData(initialFormState);
    setEditingPackage(null);
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      ...pkg,
      isUnlimitedBranches: pkg.branchLimit === 'Unlimited',
      branchLimit: pkg.branchLimit === 'Unlimited' ? '' : pkg.branchLimit.toString(),
    });
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        >
          <FiPlus /> Create Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                <p className="text-purple-600 text-lg font-medium">{pkg.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="text-gray-500 hover:text-purple-600 p-2"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-gray-500 hover:text-red-600 p-2"
                >
                  <FiTrash />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FiGitBranch />
                <span>Branch Limit: {pkg.branchLimit}</span>
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                        branchLimit: e.target.value === 'unlimited' ? '' : '1'
                      })}
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
                        onChange={(e) => setFormData({ ...formData, branchLimit: e.target.value })}
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
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.features.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
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
