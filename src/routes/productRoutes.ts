import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

router.get('/produtos', getProducts);
router.get('/produtos/:id', getProductById);
router.post('/produtos', createProduct);
router.put('/produtos/:id', updateProduct);
router.delete('/produtos/:id', deleteProduct);

export default router;
