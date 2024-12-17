import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { initDB, dbOperations } from '../utils/indexedDB';

const MedicineForm = ({ onAddMedicine }) => {
  const navigate = useNavigate();
  const [db, setDB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicine_name: '',
    cost: '',
    quantity: '',
    purchase_date: '',
    expiry_date: '',
    total_payment: ''
  });

  const [errors, setErrors] = useState({
    medicine_name: '',
    cost: '',
    quantity: '',
    purchase_date: '',
    expiry_date: ''
  });

  // Initialize IndexedDB
  useEffect(() => {
    const setupDB = async () => {
      try {
        const database = await initDB();
        setDB(database);
      } catch (error) {
        console.error("Error initializing database:", error);
        toast.error("Failed to initialize database");
      }
    };
    setupDB();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Auto-calculate total payment when cost or quantity changes
    if (name === 'cost' || name === 'quantity') {
      const cost = name === 'cost' ? value : formData.cost;
      const quantity = name === 'quantity' ? value : formData.quantity;
      if (cost && quantity) {
        const total = parseFloat(cost) * parseInt(quantity);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          total_payment: total.toFixed(2)
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.medicine_name.trim()) {
      newErrors.medicine_name = 'Name is required';
    }
    
    // if (!formData.cost || formData.cost <= 0) {
    //   newErrors.cost = 'Cost must be positive';
    // }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be positive';
    }
    
    // if (!formData.purchase_date) {
    //   newErrors.purchase_date = 'Purchase date is required';
    // }
    
    // if (!formData.expiry_date) {
    //   newErrors.expiry_date = 'Expiry date is required';
    // } else if (new Date(formData.expiry_date) <= new Date(formData.purchase_date)) {
    //   newErrors.expiry_date = 'Expiry date must be after purchase date';
    // }

    // Check if medicine is expiring soon (within 30 days)
    if (formData.expiry_date) {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
        toast(`Medicine will expire in ${daysUntilExpiry} days`, {
          icon: '⚠️',
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !db) return;

    setLoading(true);
    try {
      const medicineWithId = {
        ...formData,
        id: Date.now().toString(),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
        total_payment: parseFloat(formData.total_payment),
        createdAt: new Date().toISOString()
      };

      // Add to IndexedDB
      await dbOperations.addMedicine(db, medicineWithId);

      // Use onAddMedicine instead of setMedicines
      if (onAddMedicine) {
        onAddMedicine(medicineWithId);
      }

      // Reset form
      setFormData({
        medicine_name: '',
        cost: '',
        quantity: '',
        purchase_date: '',
        expiry_date: '',
        total_payment: ''
      });

      toast.success('Medicine added successfully!');
      navigate('/dashboard/medicines');
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-4xl mx-auto mt-4 sm:mt-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Medicine Name Field */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name *
          </label>
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleChange}
            placeholder="Enter medicine name"
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.medicine_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.medicine_name && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.medicine_name}
            </span>
          )}
        </div>

        {/* Cost Field */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              className={`w-full pl-7 pr-3 py-2 text-sm sm:text-base rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.cost ? 'border-red-500' : 'border-gray-300'
              }`}
              step="0.01"
              min="0"
            />
          </div>
          {errors.cost && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.cost}
            </span>
          )}
        </div>

        {/* Quantity Field */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors.quantity && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.quantity}
            </span>
          )}
        </div>

        {/* Purchase Date Field */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.purchase_date ? 'border-red-500' : 'border-gray-300'
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.purchase_date && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.purchase_date}
            </span>
          )}
        </div>

        {/* Expiry Date Field */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.expiry_date ? 'border-red-500' : 'border-gray-300'
            }`}
            min={formData.purchase_date || new Date().toISOString().split('T')[0]}
          />
          {errors.expiry_date && (
            <span className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.expiry_date}
            </span>
          )}
        </div>

        {/* Total Payment Display */}
        {formData.cost && formData.quantity && (
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Payment
            </label>
            <div className="w-full px-4 py-2 text-sm sm:text-base rounded-md border border-gray-300 bg-gray-50">
              ₹{formData.total_payment}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium
            ${loading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }
            transition-colors duration-200 text-sm sm:text-base
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm sm:text-base">Adding Medicine...</span>
            </span>
          ) : (
            'Add Medicine'
          )}
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;
