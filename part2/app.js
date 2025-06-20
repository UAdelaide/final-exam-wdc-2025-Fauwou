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
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.post("/api/login", async function(req, res, next){
 try {
    var { username, password } = req.body

    var [users] = await db.execute
    (
        `SELECT user_id, username, role FROM Users
        WHERE username = ? AND password_hash = ?`,
        [username, password]
    )

    if ()
}
 catch (errorM) {
    console.error("da login fail forever:", errorM)
    res.status(500).json({
        success: false,
        message: "we love server errors so much"
    })
 }
})





app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;