require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const router=require('./routers/publicRouter')
const session = require('express-session');
const database=require('./models/connection')
app.use(session({
    secret: 'your-secret-key',   // change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set secure:true if using HTTPS
}))

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/',router)

database.connectToDatabase()
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});