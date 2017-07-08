// *********************************************************************************
// tasks-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the "Wings"
  app.get("/api/tasks", function(req, res) {
    // findAll returns all entries for a table when used with no options

    db.Tasks.findAll({}).then(function(dbWing) {
      // We have access to the tasks as an argument inside of the callback function
      res.json(dbWing);
    });
  });

  // POST route for saving a new task
  app.post("/api/tasks", function(req, res) {
    // create takes an argument of an object describing the task we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Tasks.create({
      title: req.body.title,
      description: req.body.description,
      tools: req.body.tools,
      timeframe: req.body.timeframe,
      payment: req.body.payment,
      payment_type: req.body.payment_type,
      status: req.body.status
    }).then(function(dbWing) {
      // We have access to the new task as an argument inside of the callback function
      res.json(dbWing);
    });
  });

  // DELETE route for deleting tasks. We can get the id of the task to be deleted from
  // req.params.id
  //This can be done once a task has been completed
  app.delete("/api/tasks/:id", function(req, res) {
    // We just have to specify which task we want to destroy with "where"
    db.Tasks.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbWing) {
      res.json(dbWing);
    });

  });

  // PUT route for updating tasks. We can get the updated task data from req.body
  app.put("/api/tasks", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Tasks.update({
      title: req.body.title,
      description: req.body.description,
      tools: req.body.tools,
      timeframe: req.body.timeframe,
      payment: req.body.payment,
      payment_type: req.body.payment_type,
      status: req.body.status
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbWing) {
      res.json(dbWing);
    });
  });
};
