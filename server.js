const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// Allow CORS for all origins (for testing)
app.use(cors());
// If you need to restrict to only one domain, use this:
// app.use(cors({ origin: 'https://your-frontend-url.com' }));

app.use(bodyParser.json());

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to HieroScribe Backend!');
});

// Read comments
app.get('/comments', (req, res) => {
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading comments');
    res.json(JSON.parse(data || '[]'));
  });
});

// Add a comment
app.post('/comments', (req, res) => {
  const { name, text } = req.body;
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    const comments = err ? [] : JSON.parse(data);
    const newComment = { name, text };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err => {
      if (err) return res.status(500).send('Error saving comment');
      res.status(201).json(newComment);
    });
  });
});

// Delete a comment (by matching name + text)
app.delete('/comments', (req, res) => {
  const { name, text } = req.body;
  fs.readFile(COMMENTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading comments');
    let comments = JSON.parse(data);
    comments = comments.filter(comment => !(comment.name === name && comment.text === text));
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), err => {
      if (err) return res.status(500).send('Error deleting comment');
      res.status(200).json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
