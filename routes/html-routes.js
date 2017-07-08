// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");
// ===============================================================================
// ROUTING
// ===============================================================================
module.exports = function(app) {
  // HTML GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases the user is shown an HTML page of content
  // ---------------------------------------------------------------------------

  //index route loads view.html
  app.get("/", function(req, res) {
    res.sendfile(path.join(__dirname, "..public/view.html"));
  });

  //sends the customer to the form where they fill out all information about the task
  app.get("/task", function(req, res) {
    res.sendFile(path.join(__dirname, "/../public/task.html"));
  });

  //sends the contractor to the form where they fill out all information about the task
  app.get("/view", function(req, res) {
    res.sendFile(path.join(__dirname, "/../public/view.html"));
  });

  // If no matching route is found default to home
  app.use(function(req, res) {
    res.sendFile(path.join(__dirname, "/../public/index.html"));
  });
};
