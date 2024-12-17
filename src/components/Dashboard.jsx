import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MedicineForm from './MedicineForm';
import MedicineTable from './MedicineTable';

const Dashboard = () => {
  const [medicines, setMedicines] = useState(() => {
    const savedMedicines = localStorage.getItem('medicines');
    return savedMedicines ? JSON.parse(savedMedicines) : [];
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  const addMedicine = (newMedicine) => {
    const medicineWithId = {
      ...newMedicine,
      id: Date.now(),
    };
    setMedicines((prevMedicines) => [...prevMedicines, medicineWithId]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Medicine Management</h1>
              <p className="text-blue-100 mt-2 text-base sm:text-lg">Streamline your pharmacy operations</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center bg-blue-700/50 rounded-lg px-4 py-2 backdrop-blur-sm w-full sm:w-auto">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="ml-2 font-semibold text-base sm:text-lg">Shahrukh</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out flex items-center w-full sm:w-auto justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Inventory Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Inventory</h3>
                <p className="text-gray-500 text-sm sm:text-base">Manage stock levels</p>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Orders</h3>
                <p className="text-gray-500 text-sm sm:text-base">Track purchases</p>
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Analytics</h3>
                <p className="text-gray-500 text-sm sm:text-base">View reports</p>
              </div>
            </div>
          </div>

          {/* Expiry Tracking Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">Expiry Tracking</h3>
                <p className="text-gray-500 text-sm sm:text-base">Monitor dates</p>
              </div>
            </div>
          </div>
        </div>

      {/* Add Medicine Button */}
<div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
  <motion.button
    onClick={() => setIsFormVisible(!isFormVisible)}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
               py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-md 
               transition duration-300 ease-in-out flex items-center space-x-2 
               transform hover:scale-105 w-[40%] sm:w-auto justify-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <span className="text-sm sm:text-base">
      {isFormVisible ? 'Hide Form' : 'Add New Medicine'}
    </span>
  </motion.button>
</div>


        {/* Medicine Form */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Medicine</h3>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Enter the medicine details below</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 rounded-lg"></div>
                    <div className="relative z-10">
                      <MedicineForm onAddMedicine={addMedicine} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medicine Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <MedicineTable medicines={medicines} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
