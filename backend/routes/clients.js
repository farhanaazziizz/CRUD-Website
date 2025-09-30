import express from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getExpiringSoon
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getAllClients);
router.get('/stats', getClientStats);
router.get('/expiring-soon', getExpiringSoon);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;