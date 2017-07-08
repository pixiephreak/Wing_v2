// *********************************************************************************
// contractor-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the contractors
  app.get("/api/contractor", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Contractor.findAll({}).then(function(dbWing) {
      // We have access to the contractors as an argument inside of the callback function
      res.json(dbWing);
    });
  });


  // POST route for saving a new contractor
  app.post("/api/contractor", function(req, res) {
    // create takes an argument of an object describing the contractor we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Contractor.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.email,
      work: req.body.work
    }).then(function(dbWing) {
      // We have access to the new contractor as an argument inside of the callback function
      res.json(dbWing);
    });
  });

  // DELETE route for deleting contractors. We can get the id of the contractor to be deleted from
  // req.params.id
  //This can be done once a contractor has been completelt set up
  app.delete("/api/contractor/:id", function(req, res) {
    // We just have to specify which contractor we want to destroy with "where"
    db.Contractor.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbWing) {
      res.json(dbWing);
    });

  });

  // PUT route for updating contractors. We can get the updated contractor data from req.body
  app.put("/api/contractor", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Contractor.update({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.email,
      work: req.body.work
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbWing) {
      res.json(dbWing);
    });
  });
};
