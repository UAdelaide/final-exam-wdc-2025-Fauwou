const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const session = require("express-session") //added this

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');


//everything below here added
app.post("/api/login", async function(req, res,next){
 try {


}
 catch (errorM) {
    console.error("da login fail forever:")
 }
})





app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;