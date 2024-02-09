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
// Changed to / because wildcard * was not loading notes
// Trying to find fix to meet ReadMe requirements
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET request /api/notes
// This is used to get the existing notes from /db.json to load
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        // logs error if there is an error reading db.json
        console.error(err);
        // sends server error response
        return res.status(500).send('Error! Could not read notes.');
    }
    // sends the parsed notes as json response
    res.json(JSON.parse(data));
  });
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
  // logs the post request
  console.info(`${req.method} request received to add a note`);
  // Destructures title and text in req.body
  const { title, text } = req.body;
  // Checks if title and text are provided
  if (title && text) {
    const newNote = {
        title,
        text,
        id: uuid.v4(), // Will generate RANDOM ID because of uuidv4
    };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
      // JSON parse the notes
      const notes = JSON.parse(data);
      // Pushes newNote to notes
      notes.push(newNote);
    
    // writes to notes array to db.json with newNote added to notes
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) => 
    writeErr
    ? console.error(writeErr)
    : console.info('Success! Added new note!')
    );
    }
  });
  // Sends a response with new note
  res.status(201).json({
    status: 'success',
    body: newNote,
  });
  } else {
    // Sends an error response if note title or text is missing
    res.status(500).json('Error posting note');
  }
});

//Delete /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
//id from the request url
  const notesId = req.params.id; 

// This is to read the current saved notes in the db.json
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error!')  
    }

    // json parsing the notes
    const notes = JSON.parse(data);
    // filtering the notes to remove the current note, which is found by its Id
    const newNotes = notes.filter(data => data.id !== notesId);

    // writing the updated new notes to the db.json
    fs.writeFile('./db/db.json', JSON.stringify(newNotes, null, 4), (err) => {
        if (err) {
          console.error(err);
          // if error, it will log error
          return res.status(500).send('Error! Could not save new notes list after deletion');
        }
        // confirming that the note was deleted
          console.info('Success! Deleted note!');
          return res.json({ message: 'Success! Deleted note!' });
    });
  });
});

//Load server
app.listen(PORT, () => 
  console.log(`Express.js: Note Taker app is listening at http://localhost:${PORT}`)
);