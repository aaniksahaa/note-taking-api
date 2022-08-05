const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const path  = require('path');
//models
const Users=require('./models/users');
const Notes = require("./models/notes");

//controllers
const notes = require('./controllers/notes');
const authRoutes = require('./routes/auth');

const { requireAuth,checkUser } = require('./middlewares/authMiddleware');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://jaber:12345@cluster0.wbojd.mongodb.net/notedb?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(express.text())
app.use(express.static('public'))
app.use(cookieParser());

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('[+] Established Connection with mongo', mongoURI);
});
mongoose.connection.on('error', (err) => console.log(err.message));
mongoose.connection.on('disconnected', () => console.log('[!] Mongo disconnected'));

app.use('/users', authRoutes);
app.use('/notes',notes);

app.get('/set-cookies',requireAuth,(req,res)=> {
  res.cookie('newUser',false);
  res.cookie('hudae',true,{maxAge: 1000*60*60*24, httpOnly: false});
  res.json({})
});
app.get('/get-cookies',(req,res)=>{
  res.json(req.cookies);
});

app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname,'build','index.html'));
});
app.listen(PORT, () => {
  console.log(`[+] Listening on ... ${PORT}`);
});
