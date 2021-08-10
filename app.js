const path = require('path');
const express = require('express');
const mongoose= require('mongoose');
const multer = require('multer');



const { cors } = require('./middleware/index');

const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
})
const fileFilter = (req, file, cb) => {
  const validFiles = ['image/png', 'image/jpg','image/jpeg'];
  console.log(file.mimetype)
  if  (validFiles.includes(file.mimetype)) {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors);

// load feed router
app.use('/feed', feedRouter);

// load feed router
app.use('/auth', authRouter);
// logging errors
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, data: error.data});
})

mongoose.connect(
  'mongodb+srv://dbUser:Bathoryring1.@cluster0.gm6iq.mongodb.net/messages',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  ).then(() => {
    app.listen('8080', () => {})
  })




