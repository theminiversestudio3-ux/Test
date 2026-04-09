import { Router } from 'express';
import { adminDb } from '../../core/firebaseAdmin';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import { ProductSchema, CategorySchema } from '../../../shared/schemas';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all active categories
router.get('/categories', async (req, res, next) => {
  try {
    const snapshot = await adminDb.collection('categories').where('isActive', '==', true).get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Get all active products
router.get('/products', async (req, res, next) => {
  try {
    const snapshot = await adminDb.collection('products').where('isActive', '==', true).get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get single product by ID
router.get('/products/:id', async (req, res, next) => {
  try {
    const doc = await adminDb.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all products (including inactive)
router.get('/admin/products', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    const snapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/products', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    const validatedData = ProductSchema.parse(req.body);
    const docRef = await adminDb.collection('products').add({
      ...validatedData,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ success: true, data: { id: docRef.id, ...validatedData } });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/products/:id', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    const validatedData = ProductSchema.parse(req.body);
    await adminDb.collection('products').doc(req.params.id).update({
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, data: { id: req.params.id, ...validatedData } });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/products/:id', requireAuth, requireRole(['admin']), async (req, res, next) => {
  try {
    await adminDb.collection('products').doc(req.params.id).delete();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export const catalogRouter = router;
