import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Toaster, toast } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MedicineTable from './components/MedicineTable';
import MedicineForm from './components/MedicineForm';
import { initDB, dbOperations } from './utils/indexedDB';






const App = () => {
  const [medicines, setMedicines] = useState([]);
  const [db, setDB] = useState(null);

  // Initialize IndexedDB and load initial data
  useEffect(() => {
    const setupDB = async () => {
      try {
        const database = await initDB();
        setDB(database);
        const data = await dbOperations.getAllMedicines(database);
        setMedicines(data);
      } catch (error) {
        console.error("Error setting up database:", error);
        toast.error("Failed to initialize database");
      }
    };
    setupDB();
  }, []);

  // Enhanced function to handle adding new medicine
  const handleAddMedicine = async (newMedicine) => {
    try {
      // Add an ID and timestamp to the new medicine
      const medicineWithId = {
        ...newMedicine,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      // Add to IndexedDB
      await dbOperations.addMedicine(db, medicineWithId);
      
      // Update the state immediately for real-time display
      setMedicines(prevMedicines => [...prevMedicines, medicineWithId]);
      
      // Show success notification
      toast.success('Medicine added successfully');
      
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error('Failed to add medicine');
      return false;
    }
  };

  // Function to handle medicine deletion
  const handleDeleteMedicine = async (medicineId) => {
    try {
      await dbOperations.deleteMedicine(db, medicineId);
      setMedicines(prevMedicines => 
        prevMedicines.filter(medicine => medicine.id !== medicineId)
      );
      toast.success('Medicine deleted successfully');
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error('Failed to delete medicine');
    }
  };

  // Function to handle medicine updates
  const handleUpdateMedicine = async (updatedMedicine) => {
    try {
      await dbOperations.updateMedicine(db, updatedMedicine);
      setMedicines(prevMedicines =>
        prevMedicines.map(medicine =>
          medicine.id === updatedMedicine.id ? updatedMedicine : medicine
        )
      );
      toast.success('Medicine updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error('Failed to update medicine');
      return false;
    }
  };

  return (
    <>


    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#34D399',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
                color: 'white',
              },
            },
            style: {
              border: '1px solid #E5E7EB',
              padding: '16px',
              borderRadius: '8px',
            },
            duration: 3000,
          }}
        />
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route 
              index 
              element={
                <MedicineTable 
                  medicines={medicines} 
                  setMedicines={setMedicines}
                  db={db}
                  onDelete={handleDeleteMedicine}
                  onUpdate={handleUpdateMedicine}
                />
              } 
            />
            <Route 
              path="add-medicine" 
              element={
                <MedicineForm 
                  onAddMedicine={handleAddMedicine}
                  db={db}
                />
              } 
            />
            <Route 
              path="medicines" 
              element={
                <MedicineTable 
                  medicines={medicines} 
                  setMedicines={setMedicines}
                  db={db}
                  onDelete={handleDeleteMedicine}
                  onUpdate={handleUpdateMedicine}
                />
              } 
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
};

export default App;
