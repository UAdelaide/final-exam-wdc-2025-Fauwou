var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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



















/*pre-existing info as sample/ current data*/

await db.execute
(`

`)

await db.execute
(`

`)

await db.execute
(`

`)

await db.execute
(`

`)


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
