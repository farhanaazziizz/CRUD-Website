import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', process.env.DB_PATH || './database.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        // Add a small delay to ensure database is ready
        setTimeout(() => {
          this.init();
        }, 100);
      }
    });
  }

  init() {
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
    this.createTables();
  }

  createTables() {
    return new Promise((resolve, reject) => {
      // Create clients table
      const createClientsTable = `
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_name TEXT NOT NULL,
          business_type TEXT NOT NULL,
          client_address TEXT NOT NULL,
          client_location TEXT NOT NULL,
          certificate_expiry_date DATE NOT NULL,
          last_audit_date DATE NOT NULL,
          certification_body TEXT NOT NULL,
          contact_person TEXT NOT NULL,
          phone_email TEXT NOT NULL,
          status TEXT DEFAULT 'Active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create notifications table
      const createNotificationsTable = `
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'warning',
          days_remaining INTEGER NOT NULL,
          is_read BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
      `;

      // Create system_logs table
      const createSystemLogsTable = `
        CREATE TABLE IF NOT EXISTS system_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes
      const createIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)',
        'CREATE INDEX IF NOT EXISTS idx_clients_expiry ON clients(certificate_expiry_date)',
        'CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)',
        'CREATE INDEX IF NOT EXISTS idx_notifications_client ON notifications(client_id)'
      ];

      this.db.serialize(() => {
        this.db.run(createClientsTable, (err) => {
          if (err) {
            console.error('Error creating clients table:', err);
            reject(err);
            return;
          }
        });

        this.db.run(createNotificationsTable, (err) => {
          if (err) {
            console.error('Error creating notifications table:', err);
            reject(err);
            return;
          }
        });

        this.db.run(createSystemLogsTable, (err) => {
          if (err) {
            console.error('Error creating system_logs table:', err);
            reject(err);
            return;
          }
        });

        // Create indexes
        let indexCount = 0;
        createIndexes.forEach(indexQuery => {
          this.db.run(indexQuery, (err) => {
            if (err) {
              console.error('Error creating index:', err);
            }
            indexCount++;
            if (indexCount === createIndexes.length) {
              console.log('Database tables created successfully');
              resolve();
            }
          });
        });
      });
    });
  }

  // Helper methods for queries
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

const database = new Database();
export default database;