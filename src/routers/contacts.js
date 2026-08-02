import express from 'express';
import contactsController from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchema.js';

const router = express.Router();

router.use(authenticate);

router.use('/:contactId', isValidId);

router.get('/', contactsController.getContacts);
router.get('/:contactId', contactsController.getContact);
router.post('/', validateBody(createContactSchema), contactsController.createContact);
router.patch('/:contactId', validateBody(updateContactSchema), contactsController.updateContact);
router.delete('/:contactId', contactsController.deleteContact);

export default router;
