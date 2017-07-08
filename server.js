// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require('path');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static(process.cwd()+ "/public"));

// Routes =============================================================

// require("./routes/html-routes.js")(app);
// require("./routes/tasks-api-routes.js")(app);
// require("./routes/customer-api-routes.js")(app);
// require("./routes/contractor-api-routes.js")(app);

// GET route for getting all of the customers
app.get("/api/userprofile", function(req, res) {
  // findAll returns all entries for a table when used with no options
  db.Customer.findAll({}).then(function(dbWing) {
  // We have access to the customers as an argument inside of the callback function
  res.json(dbWing);
  });
});

// POST route for saving a new customer
app.post("/api/userprofile", function(req, res) {

  // create customer as an argument of an object we want to
  // insert into our table. In this case we just we pass in an object with a text
  // and complete property (req.body)
  db.Customer.create({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    streetaddress: req.body.streetaddress,
    streetaddress2: req.body.streetaddress2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    password: req.body.password
  }).then(function(dbWing) {
    // We have access to the new customer as an argument inside of the callback function
    res.json(dbWing.dataValues);
  });
});

app.get("/contractor-tasks", function(req, res){
  //show accpeted contractor tasks in here;
});

// DELETE route for deleting customers. We can get the id of the customer to be deleted from
// req.params.id
app.get("/api/customer/:id", function(req, res) {
  console.log(req.params.id);
  // findAll returns all entries for a table when used with no options
  db.Customer.findAll({
    where: {
      id: req.params.id
    }
  }).then(function(dbWing) {
  // We have access to the customers as an argument inside of the callback function
  res.json(dbWing);
  });
});

// DELETE route for deleting customers. We can get the id of the customer to be deleted from
// req.params.id
app.delete("/api/customer/:id", function(req, res) {
  // We just have to specify which custome we want to destroy with "where"
  db.Customer.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(dbWing) {
    res.json(dbWing);
  });

});


// PUT route for updating wings. We can get the updated wing data from req.body
app.put("/api/accept/:id", function(req, res) {

  // Update takes in an object describing the properties we want to update, and
  // we use where to describe which objects we want to update
  db.Task.update({
    status: req.body.status,
    contractorId: req.body.currentUser
  }, {
    where: {
      //primary key on Task
      id: req.body.id
    }
  }).then(function(dbWing) {
    res.json(dbWing);
  });
});

//TO-DO: TASK ROUTE?
// POST route for saving a new task
app.post("/api/task", function(req, res) {
  console.log('posting task');
  console.log(req.body);
  //var current = localStorage.getItem('currentCustomer');
  db.Tasks.create({
    title: req.body.title,
    description: req.body.description,
    tools: req.body.tools,
    timeframe: req.body.timeframe,
    payment: req.body.payment,
    payment_type: req.body.payment_type,
    status: req.body.status,
    customerId: req.body.customerId
  }).then(function(dbWing) {
    // We have access to the new customer as an argument inside of the callback function
    res.json(dbWing);
  });
});

// GET route for getting all of the customers
app.get("/api/task", function(req, res) {
  // findAll returns all entries for a table when used with no options
  db.Tasks.findAll({}).then(function(dbWing) {
  // We have access to the customers as an argument inside of the callback function
  res.json(dbWing);
  });
});

// HTML GET Requests
// Below code handles when users "visit" a page.
// In each of the below cases the user is shown an HTML page of content
// ---------------------------------------------------------------------------

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//sends the customer to the form where they fill out all information about the task
app.get("/profile", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/profile.html"));
});

app.get("/select", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/select.html"));
});

app.get("/tasks", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});

app.get("/contractor", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/map.html"));
});

app.get("/task_list", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/task_list.html"));
});

// Syncing our sequelize models and then starting our express app
//removed force: true but put back for dev if you wish
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
