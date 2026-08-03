import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const specPath = join(__dirname, '../../docs/swagger.json');
const swaggerDocument = JSON.parse(await readFile(specPath, 'utf8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;