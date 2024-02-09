// Importing everything here
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
// uuid will be using uuid for creating ids, v4 allows random id making

// PORT
const PORT = 3001;

// EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Link to notes page
app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
//Link to main page
//Normally I just use '/' but readme is asking for wildcald * not sure which is normal practice
// Wildcard just gets anything not declared above
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET request /api/notes

// POST /api/notes

//Delete /api/notes/:id

//Load server
app.listen(PORT, () => 
  console.log(`Express.js: Note Taker app is listening at http://localhost:${PORT}`)
);