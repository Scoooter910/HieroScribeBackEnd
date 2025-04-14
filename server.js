const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for comments
let comments = [];

app.use(cors());
app.use(bodyParser.json());

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to HieroScribe Backend!');
});

// Read comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Add a comment
app.post('/comments', (req, res) => {
  const { name, text } = req.body;
  
  if (!name || !text) {
    return res.status(400).send('Name and text are required!');
  }
  
  const newComment = { name, text };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Delete a comment (by matching name + text)
app.delete('/comments', (req, res) => {
  const { name, text } = req.body;
  
  if (!name || !text) {
    return res.status(400).send('Name and text are required!');
  }

  comments = comments.filter(comment => !(comment.name === name && comment.text === text));
  
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
