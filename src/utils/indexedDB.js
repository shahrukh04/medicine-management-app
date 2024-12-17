// indexedDB.js
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MedicineDB", 1);

    request.onerror = () => reject("Error opening database");

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("medicines")) {
        db.createObjectStore("medicines", { keyPath: "id" });
      }
    };
  });
};

export const dbOperations = {
  getAllMedicines: async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readonly");
      const store = transaction.objectStore("medicines");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
      request.onerror = () => reject(request.error);
    });
  },

  addMedicine: async (db, medicine) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readwrite");
      const store = transaction.objectStore("medicines");
      
      // Add timestamp and ID if not present
      const medicineToAdd = {
        ...medicine,
        id: medicine.id || Date.now(),
        createdAt: new Date().toISOString()
      };

      const request = store.add(medicineToAdd);

      request.onsuccess = () => {
        resolve(request.result);
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
      request.onerror = () => reject(request.error);

      // Handle transaction completion
      transaction.oncomplete = () => {
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
    });
  },

  updateMedicine: async (db, medicine) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readwrite");
      const store = transaction.objectStore("medicines");
      
      // Add updated timestamp
      const medicineToUpdate = {
        ...medicine,
        updatedAt: new Date().toISOString()
      };

      const request = store.put(medicineToUpdate);

      request.onsuccess = () => {
        resolve(request.result);
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
      request.onerror = () => reject(request.error);

      // Handle transaction completion
      transaction.oncomplete = () => {
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
    });
  },

  deleteMedicine: async (db, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readwrite");
      const store = transaction.objectStore("medicines");
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(request.result);
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
      request.onerror = () => reject(request.error);

      // Handle transaction completion
      transaction.oncomplete = () => {
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
    });
  },

  // New method to get a single medicine
  getMedicineById: async (db, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readonly");
      const store = transaction.objectStore("medicines");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // New method to clear all medicines
  clearAllMedicines: async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["medicines"], "readwrite");
      const store = transaction.objectStore("medicines");
      const request = store.clear();

      request.onsuccess = () => {
        resolve(request.result);
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('medicinesUpdated'));
      };
      request.onerror = () => reject(request.error);
    });
  }
};

// Add a helper function to check if database is initialized
export const isDBInitialized = (db) => {
  return db !== null && db !== undefined;
};

// Add event listener setup function
export const setupDBEventListeners = (callback) => {
  window.addEventListener('medicinesUpdated', callback);
  return () => window.removeEventListener('medicinesUpdated', callback);
};
