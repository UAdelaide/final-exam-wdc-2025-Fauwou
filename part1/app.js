var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var path = require('path')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


                                                                        /* ^ regular section */



                                            /* DATABASE SECTION */
let db;
/* this is somuch man*/

(async function()
{
    try {
        var connection = await mysql.createConnection
        ({
            host: "localhost",
            user: "root",
            password: "",
            multiplestatements: true
        })

        var SQLGrabber = fs.readFileSync(
            path.join(__dirname, "dogwalks.sql"), "utf8"
        )
        await connection.query(SQLGrabber)
        await connection.end()

        db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "DogWalkService"
        })

    await dataTesting() /* please work as well later */

    } catch (errorM) {
        console.error("database setup did not finish:", errorM)
    }
})()




/*pre-existing info as sample/ current data*/

async function dataTesting()
{
await db.execute
(`
 INSERT INTO Users (username, email, password_hash, role) VALUES
	("alice123", "alice@example.com", "hashed123", "owner"),
	("bobwalker", "bob@example.com", "hashed456", "walker"),
	("carol123", "carol@example.com", "hashed789", "owner"),
	("davetruss", "dave@example.com", "hashed101", "walker"),
	("makirui", "makirui@example.com", "hashed999", "owner");
`)

await db.execute
(`
 INSERT INTO Dogs (owner_id, name, size) VALUES
    ((SELECT user_id FROM Users WHERE username = "alice123"), "Max", "medium"),
	((SELECT user_id FROM Users WHERE username = "carol123"), "Bella", "small"),
	((SELECT user_id FROM Users WHERE username = "alice123"), "Jerm", "large"),
	((SELECT user_id FROM Users WHERE username = "makirui"), "Cat", "small"),
	((SELECT user_id FROM Users WHERE username = "makirui"), "Snowy", "large");
`)

await db.execute
(`
 INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
    ((SELECT dog_id FROM Dogs WHERE name = "Max"), "2025-06-10 08:00:00", 30, "Parklands", "open"),
	((SELECT dog_id FROM Dogs WHERE name = "Bella"), "2025-06-10 09:30:00", 45, "Beachside Ave", "accepted"),
	((SELECT dog_id FROM Dogs WHERE name = "Jerm"), "2025-06-10 13:30:00", 60, "Norfolk Square", "cancelled"),
	((SELECT dog_id FROM Dogs WHERE name = "Cat"), "2025-06-12 07:00:00", 120, "Gerudo Park", "open"),
	((SELECT dog_id FROM Dogs WHERE name = "Snowy"), "2025-06-13 18:30:00", 30, "Mineru Ave", "open");
`)

await db.execute
(`
    INSERT INTO WalkApplications (request_id, walker_id, status) VALUES
    (1, (SELECT user_id FROM Users WHERE username = "bobwalker"), "pending"),
	(4, (SELECT user_id FROM Users WHERE username = "bobwalker"), "accepted"),
    (5, (SELECT user_id FROM Users WHERE username = "davetruss"), "accepted");
 `)

 await db.execute
(`
    INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
    (4, (SELECT user_id FROM Users WHERE username = "bobwalker"),
        (SELECT owner_id FROM Dogs Where dog_id = (SELECT dog_id FROM Walk Requests WHERE request_id = 4)),
        5, "FANTASTIC!"),
    
`)

}



/*this is taking so long, im losing my mind */
/* da routing timeees */
app.get("/api/dogs", async function(req, res, next)
{
  try {
   var [dogs] = await db.execute
      (`
	  SELECT dug.dog_id, dug.name, dug.size, person.username as owner_name
      FROM Dogs dug
      JOIN Users person ON dug.owner_id = person.user_id
    `)
    res.json(dogs)
  }
  catch (errorM) {
    res.status(500).json({ error: "No dogs found." })
  }
})


app.get("/api/walkrequests/open", async function(req, res, next)
{
  try {
  var [requests] = await db.execute
	(`
      SELECT WREQS.request_id, dug.name as dog_name, dug.size,
             WREQS.requested_time, WREQS.duration_minutes, WREQS.location
      FROM WalkRequests WREQS
      JOIN Dogs dug ON WREQS.dog_id = dug.dog_id
      WHERE WREQS.status = "open"
    `)
    res.json(requests)
	}
  catch (errorM) {
    res.status(500).json({ error: "No open requests." })
  }
})


app.get("/api/walkers/summary", async function(req, res, next)
{
  try {
	var [summary] = await db.execute
	(`
      SELECT
        person.user_id as walker_id,
        person.username as walker_name,
        COUNT(DISTINCT WAPPLY.request_id) as total_applications,
        COUNT(DISTINCT CASE WHEN WAPPLY.status = "accepted" THEN WAPPLY.request_id END) as accepted_applications,
        COUNT(DISTINCT WRAT.request_id) as completed_walks,
        COALESCE(AVG(WRAT.rating), 0) as average_rating
      FROM Users person
      LEFT JOIN WalkApplications WAPPLY ON person.user_id = WAPPLY.walker_id
      LEFT JOIN WalkRequests WREQ ON WAPPLY.request_id = WREQ.request_id AND WREQ.status = "completed"
      LEFT JOIN WalkRatings WRAT ON WREQ.request_id = WRAT.request_id
      WHERE person.role = "walker"
      GROUP BY person.user_id, person.username
    `)
    res.json(summary)


  }
  catch (errorM) {
    console.error(errorM)
    res.status(500).json({ error: "Did not receive walkers info." })
  }
})

                                                                    /* end section */

/*app.use('/', indexRouter);
app.use('/users', usersRouter);*/
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
