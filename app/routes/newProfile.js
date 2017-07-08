require("../database/models/user.js");
var db = require("../database/models");

module.exports = function(app) {
    app.post("/api/userprofile", function(req, res) {
        db.User.create(req.body).then(function(dbUser) {
            res.json(dbUser);
        });
    });
};
