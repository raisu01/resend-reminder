// dashboard.js
import express from 'express';

const router = express.Router();

// Middleware de log simple (exporté)
export const logRequest = (req, res, next) => {
  console.log(`[Dashboard] ${req.method} ${req.originalUrl}`);
  next();
};

// Route principale du dashboard
router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur le dashboard' });
});

// Route pour les requêtes utilisateur
router.get('/user', (req, res) => {
  const userId = req.query.id;
  res.json({ message: `Utilisateur ${userId || 'inconnu'}` });
});

export default router;
