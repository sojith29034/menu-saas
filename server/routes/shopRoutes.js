import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getShops,
  getShopBySlug,
  createShop,
  updateShop,
  deleteShop,
} from '../controllers/shopController.js';

const router = express.Router();

router.route('/')
  .get(getShops)
  .post(protect, createShop);

// Slug-based route for public access
router.get('/:slug', getShopBySlug);

// ID-based routes for admin operations
router.route('/id/:id')
  .put(protect, updateShop)
  .delete(protect, deleteShop);

export default router;