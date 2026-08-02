const express = require('express');
const cors = require('cors');
const pino = require('pino');
const { getAllContacts, getContactById } = require('./services/contacts');

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
      });
    } catch (error) {
      logger.error('Error fetching contacts:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
      });
    } catch (error) {
      logger.error('Error fetching contact:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
};

module.exports = setupServer;
