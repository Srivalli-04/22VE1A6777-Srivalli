const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

let items = []; // Simple in-memory storage

// POST route to upload item
app.post('/upload', upload.single('image'), (req, res) => {
  const { title, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!image  || !title  || !price) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newItem = {
    id: Date.now(),
    title,
    description,
    price,
    image,
  };
  items.push(newItem);

  res.json({ message: 'Upload successful', item: newItem });
});

// GET route to retrieve items
app.get('/items', (req, res) => {
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});