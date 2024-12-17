import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddMedicine = ({ onAddMedicine }) => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    cost: '',
    quantity: '',
    purchase_date: '',
    expiry_date: '',
    total_payment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate total payment
      const totalPayment = parseFloat(formData.cost) * parseInt(formData.quantity);
      
      const newMedicine = {
        ...formData,
        total_payment: totalPayment
      };

      // Call the passed function to add medicine
      await onAddMedicine(newMedicine);

      // Reset form
      setFormData({
        medicine_name: '',
        cost: '',
        quantity: '',
        purchase_date: '',
        expiry_date: '',
        total_payment: ''
      });

      toast.success('Medicine added successfully');
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Medicine</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name
          </label>
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost per Unit
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;
