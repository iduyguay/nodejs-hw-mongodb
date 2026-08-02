import * as contactsService from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const getAllContacts = async (req, res) => {
  const result = await contactsService.getAllContacts(req.user._id, req.query);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

const getContactById = async (req, res) => {
  const id = req.params.contactId || req.params.id;
  const contact = await contactsService.getContactById(req.user._id, id);
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

const createContact = async (req, res) => {
  const newContact = req.body;
  const photo = req.file;

  let photoUrl = null;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const contact = await contactsService.createContact(req.user._id, {
    ...newContact,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const id = req.params.contactId || req.params.id;
  const updateData = req.body;
  const photo = req.file;

  let photoUrl = null;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const contact = await contactsService.updateContact(req.user._id, id, updateData);
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

const deleteContact = async (req, res) => {
  const id = req.params.contactId || req.params.id;
  await contactsService.deleteContact(req.user._id, id);
  res.status(204).send();
};

export const contactsController = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
