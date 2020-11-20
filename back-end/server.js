const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
})
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  description: String
});

const Item = mongoose.model('Item', itemSchema);
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    description: req.body.description
  });
  try {
    console.log(item._id);
    await item.save();
    res.send(item);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})
app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.put('/api/items/:id', async (req, res) => {
  try {
    const item = Item.findOne({
      '_id': req.params.id
    }, async (err, item) => {
      item.title = req.body.title;
      item.description = req.body.description;
      await item.save();
      res.send(item);
    });

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

app.listen(3000, () => console.log('Server listening on port 3000!'));