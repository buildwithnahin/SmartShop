import { Router } from 'express';
import * as productController from './product.controller';
import { validate } from '../../middlewares/validate';
import { authenticate, authorizeRole } from '../../middlewares/auth';
import { createProductSchema, updateProductSchema } from './product.schema';

const router = Router();

// Apply auth middleware to all product routes
router.use(authenticate);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Staff and Admin can add and update products
router.post('/', authorizeRole(['ADMIN', 'STAFF']), validate(createProductSchema), productController.createProduct);
router.put('/:id', authorizeRole(['ADMIN', 'STAFF']), validate(updateProductSchema), productController.updateProduct);

// ONLY Admin can delete products
router.delete('/:id', authorizeRole(['ADMIN']), productController.deleteProduct);

export default router;
