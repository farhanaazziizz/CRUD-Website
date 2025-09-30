import database from '../config/database.js';

const initialClients = [
  {
    client_name: "PT. Maju Jaya",
    business_type: "Manufacturing",
    client_address: "Jl. Merdeka No. 10, Jakarta",
    client_location: "Jakarta",
    certificate_expiry_date: "2025-02-15",
    last_audit_date: "2024-02-10",
    certification_body: "TUV Rheinland",
    contact_person: "Budi Santoso",
    phone_email: "081234567890 / budi@majujaya.co.id",
    status: "Active"
  },
  {
    client_name: "CV. Sinar Abadi",
    business_type: "Construction",
    client_address: "Jl. Ahmad Yani No. 5, Bandung",
    client_location: "Bandung",
    certificate_expiry_date: "2025-05-20",
    last_audit_date: "2024-05-18",
    certification_body: "SGS",
    contact_person: "Andi Wijaya",
    phone_email: "081298765432 / andi@sinarabadi.co.id",
    status: "Active"
  },
  {
    client_name: "PT. Mitra Sejahtera",
    business_type: "Logistics",
    client_address: "Jl. Sudirman No. 20, Surabaya",
    client_location: "Surabaya",
    certificate_expiry_date: "2024-12-01",
    last_audit_date: "2023-12-01",
    certification_body: "Bureau Veritas",
    contact_person: "Siti Rahma",
    phone_email: "081377788899 / siti@mitrasejahtera.co.id",
    status: "Expired"
  },
  {
    client_name: "UD. Bintang Timur",
    business_type: "Food Processing",
    client_address: "Jl. Gajah Mada No. 12, Semarang",
    client_location: "Semarang",
    certificate_expiry_date: "2025-07-30",
    last_audit_date: "2024-07-25",
    certification_body: "Sucofindo",
    contact_person: "Joko Prasetyo",
    phone_email: "081355566677 / joko@bintangtimur.co.id",
    status: "Active"
  },
  {
    client_name: "PT. Global Prima",
    business_type: "Textile",
    client_address: "Jl. Diponegoro No. 7, Medan",
    client_location: "Medan",
    certificate_expiry_date: "2025-03-12",
    last_audit_date: "2024-03-10",
    certification_body: "SGS",
    contact_person: "Rina Kurnia",
    phone_email: "081399988877 / rina@globalprima.co.id",
    status: "Active"
  },
  {
    client_name: "CV. Karya Mandiri",
    business_type: "Trading",
    client_address: "Jl. Pahlawan No. 15, Yogyakarta",
    client_location: "Yogyakarta",
    certificate_expiry_date: "2025-09-05",
    last_audit_date: "2024-09-01",
    certification_body: "TUV Rheinland",
    contact_person: "Agus Salim",
    phone_email: "081344455566 / agus@karyamandiri.co.id",
    status: "Active"
  },
  {
    client_name: "PT. Nusantara Jaya",
    business_type: "Agriculture",
    client_address: "Jl. Raya No. 8, Malang",
    client_location: "Malang",
    certificate_expiry_date: "2025-01-18",
    last_audit_date: "2024-01-15",
    certification_body: "Bureau Veritas",
    contact_person: "Dewi Lestari",
    phone_email: "081388899900 / dewi@nusantarajaya.co.id",
    status: "Active"
  },
  {
    client_name: "UD. Maju Bersama",
    business_type: "Retail",
    client_address: "Jl. Veteran No. 3, Solo",
    client_location: "Solo",
    certificate_expiry_date: "2025-11-22",
    last_audit_date: "2024-11-20",
    certification_body: "Sucofindo",
    contact_person: "Hendra Kusuma",
    phone_email: "081366677788 / hendra@majubersama.co.id",
    status: "Active"
  },
  {
    client_name: "PT. Samudera Luas",
    business_type: "Shipping",
    client_address: "Jl. Pelabuhan No. 20, Makassar",
    client_location: "Makassar",
    certificate_expiry_date: "2025-04-08",
    last_audit_date: "2024-04-05",
    certification_body: "SGS",
    contact_person: "Bambang Wijaya",
    phone_email: "081322233344 / bambang@samuderaluas.co.id",
    status: "Active"
  },
  {
    client_name: "CV. Berkah Jaya",
    business_type: "Services",
    client_address: "Jl. Kemerdekaan No. 11, Palembang",
    client_location: "Palembang",
    certificate_expiry_date: "2025-06-14",
    last_audit_date: "2024-06-10",
    certification_body: "TUV Rheinland",
    contact_person: "Sri Mulyani",
    phone_email: "081355544433 / sri@berkahjaya.co.id",
    status: "Active"
  }
];

export const seedDatabase = async () => {
  try {
    // Check if database already has data
    const countResult = await database.get('SELECT COUNT(*) as count FROM clients');

    if (countResult.count === 0) {
      console.log('Seeding database with initial data...');

      for (const client of initialClients) {
        const sql = `
          INSERT INTO clients (
            client_name, business_type, client_address, client_location,
            certificate_expiry_date, last_audit_date, certification_body,
            contact_person, phone_email, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
          client.client_name,
          client.business_type,
          client.client_address,
          client.client_location,
          client.certificate_expiry_date,
          client.last_audit_date,
          client.certification_body,
          client.contact_person,
          client.phone_email,
          client.status
        ];

        await database.run(sql, params);
      }

      // Log the seeding action
      await database.run(
        'INSERT INTO system_logs (action, description) VALUES (?, ?)',
        ['Database Seeded', `Successfully seeded ${initialClients.length} clients`]
      );

      console.log(`✅ Successfully seeded ${initialClients.length} clients`);
    } else {
      console.log('Database already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export default seedDatabase;