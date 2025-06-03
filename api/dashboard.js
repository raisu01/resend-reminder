import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stockage des requêtes en mémoire
let requests = [];

// Middleware pour enregistrer les requêtes
export const logRequest = (req, res, next) => {
  const request = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    status: null,
    error: null
  };

  // Intercepter la réponse
  const oldSend = res.send;
  res.send = function(data) {
    request.status = res.statusCode;
    request.response = data;
    requests = [request, ...requests].slice(0, 100); // Garder les 100 dernières requêtes
    oldSend.apply(res, arguments);
  };

  next();
};

// Route pour la page du tableau de bord
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// API pour obtenir les requêtes
router.get('/api/requests', (req, res) => {
  res.json(requests);
});

export default router; 