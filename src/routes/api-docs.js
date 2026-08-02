import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const loadOpenApiSpec = async () => {
  try {
    const specPath = join(__dirname, '../../docs/swagger.json');
    const spec = await readFile(specPath, 'utf8');
    return JSON.parse(spec);
  } catch (error) {
    console.error('Error loading OpenAPI specification:', error);
    throw error;
  }
};

router.use('/', async (req, res, next) => {
  try {
    const spec = await loadOpenApiSpec();
    swaggerUi.setup(spec)(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;