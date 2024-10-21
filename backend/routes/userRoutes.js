const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON que actúa como base de datos
const dbPath = path.join(__dirname, '../db.json');

// Leer la "base de datos" JSON
function readDB() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

// Escribir en la "base de datos" JSON
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Obtener un perfil de usuario por ID
router.get('/profile/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(user => user.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(user);
});

// Actualizar el perfil de un usuario
router.put('/profile/:id', (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Actualizar los datos del usuario
  db.users[userIndex] = { ...db.users[userIndex], ...req.body };
  writeDB(db);

  res.json(db.users[userIndex]);
});

// Eliminar un perfil de usuario
router.delete('/profile/:id', (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(user => user.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  db.users.splice(userIndex, 1);
  writeDB(db);

  res.json({ message: 'Usuario eliminado con éxito' });
});

module.exports = router;
