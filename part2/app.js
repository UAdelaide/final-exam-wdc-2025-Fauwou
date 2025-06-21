const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const mysql = require("mysql2/promise") //declaring mysql
const session = require("express-session") //and express-session

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));


//everything below here added
app.use(session({ //initialises the sessions
    secret: "your-stupid-secret-keytemporarytest",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

let db; //redeclaring database

(async function() { //syncs the database to be connected with this version of app.js
    try {
        db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "DogWalkService"
        })
        console.log("Database 2nd time connected please") //logs to checks its running each time
    }
    catch (errorM) {
        console.error("this database hates you:", errorM)
    }
})()

app.post("/api/login", async function(req, res)//sends the login connection with database info back to page
{
 try {
    var { username, password } = req.body

    var [users] = await db.execute //checks username and user_id from existing users to send to respective role
    (
        `SELECT user_id, username, role FROM Users
        WHERE username = ? AND password_hash = ?`,
        [username, password]
    )

    if (users.length > 0) //checking they match their respective column in the database
    {
        var usering = users[0]
        req.session.usering = {
            id: usering.user_id,
            username: usering.username,
            role: usering.role
        }
        res.json({ //checks with the login via the success responses
            success:true,
            role: usering.role
        })
    } else {
        res.status(401).json({
            success:false,
            message: "Bzzzt. wrong credentials inputted."
        })
    }
}
 catch (errorM) {//error catcher for when it fails to sync
    console.error("da login fail forever:", errorM)
    res.status(500).json({
        success: false,
        message: "we love server errors so much"
    })
 }
})


app.post("/api/logout", async function(req, res) //sets up a facet for the api to access
{
    req.session.destroy(function(errorM) //asks for destruction of current session
    {
    if (errorM) { //checks for it to pass, if it fails it runs below
        console.error("we failed to log you out at this time:", errorM)
        return res.status(500).json({ //returns an error json to other files as a response instead
            success: false,
            message: "login no work"
                })
        }
        res.clearCookie("connect.sid") //clears the cookie from the current session
        res.json //stores the information in a json to pass to other files
        ({
            success: true,
            message: "we login with these"
        })
    })
})


app.get("/api/ownersdogs", async function(req,res)
{
    try {
        if (!req.session.usering || req.session.usering.role !== "owner")
                 {
                return res.status(403).json({ error: "not available, go away"})
                 }

         var [dogs] = await db.execute
        (
                `SELECT dog_id, name FROM Dogs
                 WHERE owner_id = ?`,
                [req.session.usering.id]
        )


        res.json(dogs)
    }
    catch (errorM) {
        console.error("api for doggies not coming through:", errorM)
        res.status(500).json({ error: "failed fetching for those poor dogs" })
    }
})


app.get("/api/users/me", async function(req,res)
{
    if (!req.session.usering)
    {
        return res.status(401).json({ error:"check again, you broke something"})
    }
    res.json({
        user_id: 
        username:
        role:
    })

})

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;