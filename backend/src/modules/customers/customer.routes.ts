import { Router } from 'express';
import * as customerController from './customer.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema';

const router = Router();

// Apply auth middleware to all customer routes
router.use(authenticate);

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.put('/:id', validate(updateCustomerSchema), customerController.updateCustomer);

export default router;
