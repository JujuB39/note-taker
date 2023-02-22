const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003 

app.use(express.static("public"));
app.use(express.json());

// API Routes
app.get('/api/notes', (req,res) => {
    //read notes.json
    fs.readFile(path.join(__dirname, "./Develop/db/notes.json"), 'utf8', function(err, data) {
        if (err) {
            res.status(500).json(err)
            return
        }
        const json = JSON.parse(data);
        res.json(json);
    })
});

app.post('/api/notes', (req, res) => {
    const { title, text } =req.body

    if(!title || !text) {
        res.status(400).json({ error: 'Missing title or text. '})
        return
    }

    const newNote = {
        ...req.body,
        id: Math.random()
    }

    //Read contents for adding notes
    fs.readFile(path.join(__dirname, "./Develop/db/notes.json"), 'utf8', function(err, data) {
        if (err) {
            res.status(500).json(err)
            return
        }
        const noteData = JSON.parse(data)
        //push new note into json
        noteData.push(newNote);
    //
    fs.writeFile(path.join(__dirname, "./Develop/db/notes.json"), JSON.stringify(noteData), function (err) {
        if (err) {
            res.status(500).json(err)
            return
        }
        res.status(200).json(newNote)
        })
    })
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({ error: "id is needed" })
    };

    fs.readFile(path.join(__dirname, "./Develop/db/notes.json"), "utf8", function(err, data) {
        //parse
        const noteData = JSON.parse(data)
        //modify notes
        const updatedNotes = noteData.filter(notes => id != notes.id)
        //stringify and save 
        fs.writeFile(path.join(__dirname, "./Develop/db/notes.json"), JSON.stringify(updatedNotes), function(err) {
            if (err) {
                return res.status(500).json(err)
            }
            res.json(true)
        })
    })
});


//html routes 
app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "index.html") )
});

app.get('/notes', (req, res) => {
    res.sendFile( path.join(__dirname, "public", "notes.html"))
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
