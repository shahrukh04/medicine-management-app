import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { initDB, dbOperations, setupDBEventListeners } from '../utils/indexedDB';
import AddMedicine from './AddMedicine';
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaMedkit,
  FaDollarSign,
  FaBoxes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaSearch,
  FaPlus
} from 'react-icons/fa';
import { BiFirstAid } from 'react-icons/bi';
import { MdLocalPharmacy } from 'react-icons/md';

const MedicineTable = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [db, setDB] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
   // Initialize DB and load medicines
  useEffect(() => {
    const setupDB = async () => {
      try {
        const database = await initDB();
        setDB(database);
        await loadMedicines(database);
      } catch (error) {
        console.error("Error initializing database:", error);
        toast.error("Failed to load medicines");
      }
    };
    setupDB();
  }, []);

  // Add real-time update listener
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        if (db) {
          const data = await dbOperations.getAllMedicines(db);
          setMedicines(data);
          
          const total = data.reduce((sum, medicine) => 
            sum + (parseFloat(medicine.cost) * parseFloat(medicine.quantity) || 0), 0
          );
          setTotalValue(total);
          
          const lowStock = data.filter(medicine => medicine.quantity < 10).length;
          setLowStockItems(lowStock);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Failed to load medicines");
      }
    };

    fetchMedicines();

    const cleanup = setupDBEventListeners(() => {
      fetchMedicines();
    });

    return () => cleanup();
  }, [db]);

  // Load medicines function
  const loadMedicines = async (database) => {
    try {
      setLoading(true);
      const data = await dbOperations.getAllMedicines(database);
      setMedicines(data);
      
      const total = data.reduce((sum, medicine) => 
        sum + (parseFloat(medicine.cost) * parseFloat(medicine.quantity) || 0), 0
      );
      setTotalValue(total);
      
      const lowStock = data.filter(medicine => medicine.quantity < 10).length;
      setLowStockItems(lowStock);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading medicines:", error);
      toast.error("Failed to load medicines");
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Handle edit
  const handleEdit = (medicine) => {
    setSelectedMedicine({...medicine});
  };

  // Handle update medicine
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    if (!selectedMedicine || !db) return;

    try {
      await dbOperations.updateMedicine(db, {
        id: selectedMedicine.id,
        medicine_name: selectedMedicine.medicine_name,
        cost: selectedMedicine.cost,
        quantity: selectedMedicine.quantity,
        total_payment: (selectedMedicine.cost * selectedMedicine.quantity).toFixed(2),
        purchase_date: selectedMedicine.purchase_date,
        expiry_date: selectedMedicine.expiry_date
      });
      
      setSelectedMedicine(null);
      toast.success('Medicine updated successfully');
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error("Failed to update medicine");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await dbOperations.deleteMedicine(db, id);
        toast.success('Medicine deleted successfully');
      } catch (error) {
        console.error("Error deleting medicine:", error);
        toast.error("Failed to delete medicine");
      }
    }
  };

  // Filter and sort medicines
  const sortedMedicines = React.useMemo(() => {
    let filteredMedicines = [...medicines];
    
    if (searchTerm) {
      filteredMedicines = filteredMedicines.filter(medicine =>
        medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filteredMedicines.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return sortConfig.direction === "asc"
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
    }

    return filteredMedicines;
  }, [medicines, searchTerm, sortConfig]);





  //aa code for bulk search function
// Add this state for bulk price update
const [bulkUpdatePrice, setBulkUpdatePrice] = useState('');

// Add this function for bulk price update
const handleBulkPriceUpdate = async () => {
  if (!selectedMedicineName || !bulkUpdatePrice) {
    toast.error('Please select a medicine and enter new price');
    return;
  }

  try {
    const medicinesWithSameName = medicines.filter(
      med => med.medicine_name.toLowerCase() === selectedMedicineName.toLowerCase()
    );

    for (const medicine of medicinesWithSameName) {
      await dbOperations.updateMedicine(db, {
        ...medicine,
        cost: parseFloat(bulkUpdatePrice)
      });
    }

    toast.success(`Updated price for all ${selectedMedicineName} medicines`);
    setBulkUpdatePrice('');
    setSelectedMedicineName('');
  } catch (error) {
    console.error("Error updating prices:", error);
    toast.error("Failed to update prices");
  }
};

// Add this function to get unique medicine names
const uniqueMedicineNames = React.useMemo(() => {
  return [...new Set(medicines.map(med => med.medicine_name))];
}, [medicines]);

// Add this function to group medicines by name
const groupedMedicines = React.useMemo(() => {
  return medicines.reduce((acc, medicine) => {
    const name = medicine.medicine_name.toLowerCase();
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(medicine);
    return acc;
  }, {});
}, [medicines]);



const [selectedMedicineName, setSelectedMedicineName] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [dropdownVisible, setDropdownVisible] = useState(false);

// Filtered list based on search query
const filteredMedicineNames = uniqueMedicineNames.filter((name) =>
  name.toLowerCase().includes(searchQuery.toLowerCase())
);



  //

  






     return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MdLocalPharmacy className="text-blue-500 mr-2 text-4xl" />
              Medicine Inventory
            </h1>
          
          </div>
        </div>
  
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <BiFirstAid className="text-2xl text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
              </div>
            </div>
          </motion.div>
  
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaDollarSign className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
  
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
            </div>
          </motion.div>
        </div>
  
        {/* Search and Filter Section
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
          </div>
        </div> */}
{/* Search and Filter Section */}
<div className="mb-8 space-y-6">
  {/* Search Bar */}
  <div className="relative group">
    <input
      type="text"
      placeholder="Search medicines..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 
                 bg-white/70 backdrop-blur-sm focus:border-blue-400 
                 focus:ring-4 focus:ring-blue-400/10 shadow-lg 
                 transition-all duration-300 outline-none text-gray-700 
                 placeholder-gray-400 text-lg"
    />
    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 
                        text-xl group-hover:text-blue-500 transition-colors duration-200" />
  </div>

  {/* Bulk Price Update Section */}
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl 
                  border border-gray-100">
    <div className="flex items-center mb-6">
      <div className="h-10 w-2 bg-gradient-to-b from-blue-500 to-purple-500 
                      rounded-full mr-3"></div>
      <h3 className="text-2xl font-bold text-gray-800">
        Bulk Price Update
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Select Medicine Dropdown with Search */}
  <div className="relative">
    <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
      Select Medicine
    </label>
    
    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search medicine..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
      className="w-full px-4 py-2 mb-2 rounded-xl border-2 border-gray-200
                 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 
                 transition-all duration-200 text-gray-700"
    />

    {/* Dropdown */}
    {dropdownVisible && filteredMedicineNames.length > 0 && (
      <div className="absolute z-10 w-full max-h-48 overflow-y-auto border-2 border-gray-200 
                      rounded-xl bg-white shadow-md">
        {filteredMedicineNames.map((name) => (
          <div
            key={name}
            onClick={() => {
              setSearchQuery(name); // Show the selected name in the search bar
              setSelectedMedicineName(name); // Update the selected medicine
              setDropdownVisible(false); // Hide the dropdown after selection
            }}
            className={`cursor-pointer px-4 py-2 hover:bg-blue-100 text-gray-700 
                        ${selectedMedicineName === name ? 'bg-blue-200' : ''}`}
          >
            {name}
          </div>
        ))}
      </div>
    )}

    {/* Dropdown Indicator */}
    <div className="absolute right-4 top-[42px] pointer-events-none">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>




      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
          New Price
        </label>
        <input
          type="number"
          value={bulkUpdatePrice}
          onChange={(e) => setBulkUpdatePrice(e.target.value)}
          placeholder="Enter new price"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                     bg-white/70 focus:border-blue-400 focus:ring-4 
                     focus:ring-blue-400/10 transition-all duration-200 
                     text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Update Button */}
      <div className="flex items-end">
        <button
          onClick={handleBulkPriceUpdate}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 
                     hover:from-blue-600 hover:to-purple-600 text-white rounded-xl 
                     font-medium text-lg shadow-lg hover:shadow-xl 
                     transform hover:scale-[1.02] active:scale-[0.98] 
                     transition-all duration-200 flex items-center justify-center 
                     gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Update Prices
        </button>
      </div>
    </div>

    {/* Grouped Results Section */}
    {searchTerm && (
      <div className="mt-8 space-y-4">
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Grouped Results
        </h4>
        <div className="grid gap-4">
          {Object.entries(groupedMedicines)
            .filter(([name]) => name.includes(searchTerm.toLowerCase()))
            .map(([name, medicines]) => (
              <div key={name} 
                   className="bg-gradient-to-r from-blue-50 to-purple-50 
                            p-4 rounded-xl border border-gray-100 shadow-md 
                            hover:shadow-lg transition-shadow duration-200">
                <div className="font-semibold text-lg text-gray-800 mb-2">
                  {name}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span>Quantity: {medicines.reduce((sum, med) => sum + parseInt(med.quantity), 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Price Range: ${Math.min(...medicines.map(med => parseFloat(med.cost)))} - 
                          ${Math.max(...medicines.map(med => parseFloat(med.cost)))}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )}
  </div>
</div>

             {/* Table Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'medicine_name', label: 'Medicine Name', icon: <FaMedkit /> },
                      { key: 'cost', label: 'Cost', icon: <FaDollarSign /> },
                      { key: 'quantity', label: 'Quantity', icon: <FaBoxes /> },
                      { key: 'total_payment', label: 'Total Payment', icon: <FaDollarSign /> },
                      { key: 'purchase_date', label: 'Purchase Date', icon: <FaCalendarAlt /> },
                      { key: 'expiry_date', label: 'Expiry Date', icon: <FaCalendarAlt /> },
                      { key: 'actions', label: 'Actions', icon: null }
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => column.key !== 'actions' && handleSort(column.key)}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {column.icon && <span className="text-gray-400">{column.icon}</span>}
                          <span>{column.label}</span>
                          {column.key !== 'actions' && (
                            <span className="text-gray-400">
                              {sortConfig.key === column.key ? (
                                sortConfig.direction === 'asc' ? (
                                  <FaSortUp className="inline" />
                                ) : (
                                  <FaSortDown className="inline" />
                                )
                              ) : (
                                <FaSort className="inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {sortedMedicines.map((medicine) => (
                      <motion.tr
                        key={medicine.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Medicine Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedMedicine && selectedMedicine.id === medicine.id ? (
                            <input
                              type="text"
                              value={selectedMedicine.medicine_name}
                              onChange={(e) => setSelectedMedicine({
                                ...selectedMedicine,
                                medicine_name: e.target.value
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FaMedkit className="text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {medicine.medicine_name}
                              </span>
                            </div>
                          )}
                        </td>
  
                        {/* Cost */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedMedicine && selectedMedicine.id === medicine.id ? (
                            <input
                              type="number"
                              value={selectedMedicine.cost}
                              onChange={(e) => setSelectedMedicine({
                                ...selectedMedicine,
                                cost: e.target.value,
                                total_payment: (e.target.value * selectedMedicine.quantity).toFixed(2)
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FaDollarSign className="text-green-500 mr-1" />
                              <span className="text-sm text-gray-900">{medicine.cost}</span>
                            </div>
                          )}
                        </td>
  
                        {/* Quantity */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedMedicine && selectedMedicine.id === medicine.id ? (
                            <input
                              type="number"
                              value={selectedMedicine.quantity}
                              onChange={(e) => setSelectedMedicine({
                                ...selectedMedicine,
                                quantity: e.target.value,
                                total_payment: (selectedMedicine.cost * e.target.value).toFixed(2)
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                medicine.quantity < 10
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                <FaBoxes className="mr-1" />
                                {medicine.quantity}
                              </span>
                            </div>
                          )}
                        </td>
  
                        {/* Total Payment */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaDollarSign className="text-green-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {(medicine.cost * medicine.quantity).toFixed(2)}
                            </span>
                          </div>
                        </td>
  
                        {/* Purchase Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedMedicine && selectedMedicine.id === medicine.id ? (
                            <input
                              type="date"
                              value={selectedMedicine.purchase_date}
                              onChange={(e) => setSelectedMedicine({
                                ...selectedMedicine,
                                purchase_date: e.target.value
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {new Date(medicine.purchase_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </td>
  
                        {/* Expiry Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {selectedMedicine && selectedMedicine.id === medicine.id ? (
                            <input
                              type="date"
                              value={selectedMedicine.expiry_date}
                              onChange={(e) => setSelectedMedicine({
                                ...selectedMedicine,
                                expiry_date: e.target.value
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-gray-400 mr-2" />
                              <span className={`text-sm ${
                                new Date(medicine.expiry_date) < new Date()
                                  ? 'text-red-600'
                                  : new Date(medicine.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                                  ? 'text-yellow-600'
                                  : 'text-gray-900'
                              }`}>
                                {new Date(medicine.expiry_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </td>
  
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            {selectedMedicine && selectedMedicine.id === medicine.id ? (
                              <>
                                <button
                                  onClick={handleUpdateMedicine}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <FaSave className="mr-2" />
                                  Save
                                </button>
                                <button
                                  onClick={() => setSelectedMedicine(null)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                  <FaTimes className="mr-2" />
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(medicine)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FaEdit className="mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(medicine.id)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaTrash className="mr-2" />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
  
        {/* Add Medicine Modal */}
        {showAddModal && (
          <AddMedicine
            db={db}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </div>
    );
  };
  
  export default MedicineTable;
  



















// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { initDB, dbOperations, setupDBEventListeners } from '../utils/indexedDB';
// import AddMedicine from './AddMedicine';

// const MedicineTable = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [db, setDB] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [totalValue, setTotalValue] = useState(0);
//   const [lowStockItems, setLowStockItems] = useState(0);
//   const [selectedMedicine, setSelectedMedicine] = useState(null);

//   // Initialize DB and load medicines
//   useEffect(() => {
//     const setupDB = async () => {
//       try {
//         const database = await initDB();
//         setDB(database);
//         await loadMedicines(database);
//       } catch (error) {
//         console.error("Error initializing database:", error);
//         toast.error("Failed to load medicines");
//       }
//     };
//     setupDB();
//   }, []);

//   // Add real-time update listener
//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         if (db) {
//           const data = await dbOperations.getAllMedicines(db);
//           setMedicines(data);
          
//           const total = data.reduce((sum, medicine) => sum + parseFloat(medicine.total_payment || 0), 0);
//           setTotalValue(total);
          
//           const lowStock = data.filter(medicine => medicine.quantity < 10).length;
//           setLowStockItems(lowStock);
//         }
//       } catch (error) {
//         console.error("Error fetching medicines:", error);
//         toast.error("Failed to load medicines");
//       }
//     };

//     fetchMedicines();

//     const cleanup = setupDBEventListeners(() => {
//       fetchMedicines();
//     });

//     return () => cleanup();
//   }, [db]);

//   // Load medicines function
//   const loadMedicines = async (database) => {
//     try {
//       setLoading(true);
//       const data = await dbOperations.getAllMedicines(database);
//       setMedicines(data);
      
//       const total = data.reduce((sum, medicine) => sum + parseFloat(medicine.total_payment || 0), 0);
//       setTotalValue(total);
      
//       const lowStock = data.filter(medicine => medicine.quantity < 10).length;
//       setLowStockItems(lowStock);
      
//       setLoading(false);
//     } catch (error) {
//       console.error("Error loading medicines:", error);
//       toast.error("Failed to load medicines");
//       setLoading(false);
//     }
//   };

//   // Handle sorting
//   const handleSort = (key) => {
//     setSortConfig((prevConfig) => ({
//       key,
//       direction:
//         prevConfig.key === key && prevConfig.direction === "asc"
//           ? "desc"
//           : "asc",
//     }));
//   };

//   // Handle edit
//   const handleEdit = (medicine) => {
//     setSelectedMedicine({...medicine});
//   };

//   // Handle update medicine
//   const handleUpdateMedicine = async (e) => {
//     e.preventDefault();
//     if (!selectedMedicine || !db) return;

//     try {
//       await dbOperations.updateMedicine(db, {
//         id: selectedMedicine.id,
//         medicine_name: selectedMedicine.medicine_name,
//         cost: selectedMedicine.cost,
//         quantity: selectedMedicine.quantity,
//         total_payment: selectedMedicine.total_payment,
//         purchase_date: selectedMedicine.purchase_date,
//         expiry_date: selectedMedicine.expiry_date
//       });
      
//       setSelectedMedicine(null);
//       toast.success('Medicine updated successfully');
//     } catch (error) {
//       console.error("Error updating medicine:", error);
//       toast.error("Failed to update medicine");
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this medicine?')) {
//       try {
//         await dbOperations.deleteMedicine(db, id);
//         toast.success('Medicine deleted successfully');
//       } catch (error) {
//         console.error("Error deleting medicine:", error);
//         toast.error("Failed to delete medicine");
//       }
//     }
//   };

//   // Filter and sort medicines
//   const sortedMedicines = React.useMemo(() => {
//     let filteredMedicines = [...medicines];
    
//     if (searchTerm) {
//       filteredMedicines = filteredMedicines.filter(medicine =>
//         medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortConfig.key) {
//       filteredMedicines.sort((a, b) => {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];
//         return sortConfig.direction === "asc"
//           ? aValue > bValue ? 1 : -1
//           : aValue < bValue ? 1 : -1;
//       });
//     }

//     return filteredMedicines;
//   }, [medicines, searchTerm, sortConfig]);

//   return (
//     <div className="p-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         {/* Your existing stats cards code */}
//       </div>

//       {/* Search Input */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search medicines..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="text-center py-4">Loading...</div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {[
//                     { key: 'medicine_name', label: 'Medicine Name' },
//                     { key: 'cost', label: 'Cost' },
//                     { key: 'quantity', label: 'Quantity' },
//                     { key: 'total_payment', label: 'Total Payment' },
//                     { key: 'purchase_date', label: 'Purchase Date' },
//                     { key: 'expiry_date', label: 'Expiry Date' },
//                     { key: 'actions', label: 'Actions' }
//                   ].map((column) => (
//                     <th
//                       key={column.key}
//                       onClick={() => column.key !== 'actions' && handleSort(column.key)}
//                       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                         column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
//                       }`}
//                     >
//                       {column.label}
//                       {sortConfig.key === column.key && (
//                         <span className="ml-2">
//                           {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {sortedMedicines.map((medicine) => (
//                   <tr key={medicine.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="text"
//                           value={selectedMedicine.medicine_name}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             medicine_name: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         medicine.medicine_name
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="number"
//                           value={selectedMedicine.cost}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             cost: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         `₹${medicine.cost}`
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="number"
//                           value={selectedMedicine.quantity}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             quantity: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         medicine.quantity
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="number"
//                           value={selectedMedicine.total_payment}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             total_payment: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         `₹${medicine.total_payment}`
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="date"
//                           value={selectedMedicine.purchase_date}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             purchase_date: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         medicine.purchase_date
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <input
//                           type="date"
//                           value={selectedMedicine.expiry_date}
//                           onChange={(e) => setSelectedMedicine({
//                             ...selectedMedicine,
//                             expiry_date: e.target.value
//                           })}
//                           className="w-full px-2 py-1 border rounded"
//                         />
//                       ) : (
//                         medicine.expiry_date
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       {selectedMedicine && selectedMedicine.id === medicine.id ? (
//                         <div className="space-x-2">
//                           <button
//                             onClick={handleUpdateMedicine}
//                             className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={() => setSelectedMedicine(null)}
//                             className="px-3 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="space-x-2">
//                           <button
//                             onClick={() => handleEdit(medicine)}
//                             className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(medicine.id)}
//                             className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicineTable;
