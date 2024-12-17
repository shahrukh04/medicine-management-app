import React, { useState } from "react";

const MedicineForm = ({ onAddMedicine }) => {
  const [medicineName, setMedicineName] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const handleAddMedicine = (e) => {
    e.preventDefault();
    // Add medicine logic will be added here
    onAddMedicine({
      medicine_name: medicineName,
      cost: parseFloat(cost),
      quantity: parseInt(quantity),
      total_payment: parseFloat(totalPayment),
    });
  };

  const handleCostChange = (e) => {
    setCost(e.target.value);
    setTotalPayment((prevTotal) => (quantity && cost ? cost * quantity : 0));
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setTotalPayment((prevTotal) => (cost && quantity ? cost * quantity : 0));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>
      <form onSubmit={handleAddMedicine} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Cost"
          value={cost}
          onChange={handleCostChange}
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Quantity"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Total Payment"
          value={totalPayment}
          readOnly
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Medicine
        </button>
      </form>
    </div>
  );
};

export default MedicineForm;
