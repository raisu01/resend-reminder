import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stockage des requêtes en mémoire (note: sera réinitialisé à chaque déploiement sur Vercel)
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

  if (next) next();
};

// Handler pour Vercel
export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Logger la requête
  logRequest(req, res);

  // Route pour la page du tableau de bord
  if (req.url === '/dashboard' && req.method === 'GET') {
    const htmlContent = readFileSync(path.join(__dirname, '../public/dashboard.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(htmlContent);
  }

  // API pour obtenir les requêtes
  if (req.url === '/dashboard/api/requests' && req.method === 'GET') {
    return res.json(requests);
  }

  // Route par défaut
  return res.status(404).json({ error: 'Route non trouvée' });
} 