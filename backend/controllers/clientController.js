import database from '../config/database.js';
import { calculateDaysRemaining, createResponse, createPaginationResponse } from '../utils/helpers.js';

export const getAllClients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(client_name LIKE ? OR client_location LIKE ? OR business_type LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== 'All') {
      whereConditions.push('status = ?');
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM clients ${whereClause}`;
    const countResult = await database.get(countSql, params);

    // Get paginated data
    const sql = `
      SELECT * FROM clients
      ${whereClause}
      ORDER BY certificate_expiry_date ASC
      LIMIT ? OFFSET ?
    `;

    const clients = await database.all(sql, [...params, limit, offset]);

    // Add days_remaining to each client
    const clientsWithDays = clients.map(client => ({
      ...client,
      days_remaining: calculateDaysRemaining(client.certificate_expiry_date)
    }));

    const response = createPaginationResponse(
      clientsWithDays,
      countResult.total,
      page,
      limit
    );

    res.json(response);
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json(createResponse(false, null, 'Error getting clients', error.message));
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await database.get('SELECT * FROM clients WHERE id = ?', [id]);

    if (!client) {
      return res.status(404).json(createResponse(false, null, 'Client not found'));
    }

    const clientWithDays = {
      ...client,
      days_remaining: calculateDaysRemaining(client.certificate_expiry_date)
    };

    res.json(createResponse(true, clientWithDays));
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json(createResponse(false, null, 'Error getting client', error.message));
  }
};

export const createClient = async (req, res) => {
  try {
    const {
      client_name,
      business_type,
      client_address,
      client_location,
      certificate_expiry_date,
      last_audit_date,
      certification_body,
      contact_person,
      phone_email,
      status = 'Active'
    } = req.body;

    const sql = `
      INSERT INTO clients (
        client_name, business_type, client_address, client_location,
        certificate_expiry_date, last_audit_date, certification_body,
        contact_person, phone_email, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      client_name, business_type, client_address, client_location,
      certificate_expiry_date, last_audit_date, certification_body,
      contact_person, phone_email, status
    ];

    const result = await database.run(sql, params);

    // Log the action
    await database.run(
      'INSERT INTO system_logs (action, description) VALUES (?, ?)',
      ['Client Created', `New client added: ${client_name}`]
    );

    res.status(201).json(createResponse(true, { id: result.id }, 'Client created successfully'));
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json(createResponse(false, null, 'Error creating client', error.message));
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      business_type,
      client_address,
      client_location,
      certificate_expiry_date,
      last_audit_date,
      certification_body,
      contact_person,
      phone_email,
      status
    } = req.body;

    const sql = `
      UPDATE clients SET
        client_name = ?, business_type = ?, client_address = ?, client_location = ?,
        certificate_expiry_date = ?, last_audit_date = ?, certification_body = ?,
        contact_person = ?, phone_email = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      client_name, business_type, client_address, client_location,
      certificate_expiry_date, last_audit_date, certification_body,
      contact_person, phone_email, status, id
    ];

    const result = await database.run(sql, params);

    if (result.changes === 0) {
      return res.status(404).json(createResponse(false, null, 'Client not found'));
    }

    // Log the action
    await database.run(
      'INSERT INTO system_logs (action, description) VALUES (?, ?)',
      ['Client Updated', `Client updated: ${client_name}`]
    );

    res.json(createResponse(true, null, 'Client updated successfully'));
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json(createResponse(false, null, 'Error updating client', error.message));
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Get client name first for logging
    const client = await database.get('SELECT client_name FROM clients WHERE id = ?', [id]);

    if (!client) {
      return res.status(404).json(createResponse(false, null, 'Client not found'));
    }

    const result = await database.run('DELETE FROM clients WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json(createResponse(false, null, 'Client not found'));
    }

    // Log the action
    await database.run(
      'INSERT INTO system_logs (action, description) VALUES (?, ?)',
      ['Client Deleted', `Client deleted: ${client.client_name}`]
    );

    res.json(createResponse(true, null, 'Client deleted successfully'));
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json(createResponse(false, null, 'Error deleting client', error.message));
  }
};

export const getClientStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      database.get('SELECT COUNT(*) as total_clients FROM clients'),
      database.get('SELECT COUNT(*) as active_certificates FROM clients WHERE status = "Active"'),
      database.get('SELECT COUNT(*) as expired_certificates FROM clients WHERE status = "Expired"')
    ]);

    // Get expiring soon count (≤30 days)
    const allActiveClients = await database.all('SELECT certificate_expiry_date FROM clients WHERE status = "Active"');
    const expiringSoon = allActiveClients.filter(client => {
      const daysRemaining = calculateDaysRemaining(client.certificate_expiry_date);
      return daysRemaining <= 30 && daysRemaining >= 0;
    }).length;

    const response = {
      total_clients: stats[0].total_clients,
      active_certificates: stats[1].active_certificates,
      expiring_soon: expiringSoon,
      expired_certificates: stats[2].expired_certificates
    };

    res.json(createResponse(true, response));
  } catch (error) {
    console.error('Error getting client stats:', error);
    res.status(500).json(createResponse(false, null, 'Error getting client stats', error.message));
  }
};

export const getExpiringSoon = async (req, res) => {
  try {
    const clients = await database.all(`
      SELECT * FROM clients
      WHERE status = 'Active'
      ORDER BY certificate_expiry_date ASC
      LIMIT 10
    `);

    const expiringSoon = clients
      .map(client => ({
        ...client,
        days_remaining: calculateDaysRemaining(client.certificate_expiry_date)
      }))
      .filter(client => client.days_remaining <= 30 && client.days_remaining >= 0)
      .sort((a, b) => a.days_remaining - b.days_remaining);

    res.json(createResponse(true, expiringSoon));
  } catch (error) {
    console.error('Error getting expiring soon clients:', error);
    res.status(500).json(createResponse(false, null, 'Error getting expiring soon clients', error.message));
  }
};