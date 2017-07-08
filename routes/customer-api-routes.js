// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the customers
  app.get("/api/customer", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Customer.findAll({}).then(function(dbWing) {
      // We have access to the customers as an argument inside of the callback function
      res.json(dbWing);
    });
  });

  // POST route for saving a new customer
  app.post("/api/customer", function(req, res) {
    console.log('hello');
    // create customer as an argument of an object we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Customer.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
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
  app.put("/api/wing", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Customer.update({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbWing) {
      res.json(dbWing);
    });
  });

  //make a route to get the db task info and show it to customer


};
