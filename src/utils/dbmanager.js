class OrderDatabaseManager {
  constructor() {
    this.db = null;
    this.databaseName = "orders";
    this.version = 2;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Get current version
        const oldVersion = event.oldVersion || 0;

        if (oldVersion === 1) {
          db.deleteObjectStore("config");
          db.deleteObjectStore("orders");
        }

        const ordiniStore = db.createObjectStore("orders", {
          keyPath: "id",
          autoIncrement: true,
        });
        ordiniStore.transaction.oncomplete = () => {
          console.log("Orders store created");
        };
      };
    });
  }

  async addOrder(ordine) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["orders"], "readwrite");
      const ordiniStore = transaction.objectStore("orders");

      const request = ordiniStore.add(ordine);

      request.onerror = () => {
        reject("Errore durante l'aggiunta dell'ordine");
      };

      request.onsuccess = () => {
        resolve("Ordine aggiunto con successo");
      };
    });
  }

  async getOrders() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["orders"], "readonly");
      const ordiniStore = transaction.objectStore("orders");

      const request = ordiniStore.getAll();

      request.onerror = () => {
        reject("Errore durante la lettura degli ordini");
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async deleteAllOrders() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["orders"], "readwrite");
      const ordiniStore = transaction.objectStore("orders");

      const request = ordiniStore.clear();

      request.onerror = () => {
        reject("Errore durante la cancellazione degli ordini");
      };

      request.onsuccess = () => {
        resolve("Ordini cancellati con successo");
      };
    });
  }
}

export default OrderDatabaseManager;
