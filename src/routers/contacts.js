import express from 'express';
import { contactsController } from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchema.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.use('/:contactId', isValidId);
router.use('/:id', isValidId);

router.get('/', contactsController.getAllContacts);
router.get('/:contactId', contactsController.getContactById);
router.get('/:id', contactsController.getContactById);
router.post('/', upload.single('photo'), validateBody(createContactSchema), contactsController.createContact);
router.patch('/:contactId', upload.single('photo'), validateBody(updateContactSchema), contactsController.updateContact);
router.patch('/:id', upload.single('photo'), validateBody(updateContactSchema), contactsController.updateContact);
router.put('/:contactId', upload.single('photo'), validateBody(updateContactSchema), contactsController.updateContact);
router.put('/:id', upload.single('photo'), validateBody(updateContactSchema), contactsController.updateContact);
router.delete('/:contactId', contactsController.deleteContact);
router.delete('/:id', contactsController.deleteContact);

export default router;
