(function() {
  var SECRET_DIGEST, app, childProcess, crypto, express;

  childProcess = require("child_process");

  crypto = require("crypto");

  express = require("express");

  app = express();

  SECRET_DIGEST = "65eb608c22cff0e6c4a4bef0aa04eae4e3cc6e9c42adf53965a26a57e584c7be";

  app.use(express["static"]("public"));

  app.get("/about", function(req, res) {
    return res.sendFile("about.html", {
      root: "./public"
    });
  });

  app.get("/", function(req, res) {
    return res.sendFile("index.html", {
      root: "./public"
    });
  });

  app.get("/gender", function(req, res) {
    var args, name, process, responseObject, sha;
    res.setHeader("Content-Type", "application/json");
    sha = crypto.createHash("sha256");
    if ((req.query.secret == null) || sha.update(req.query.secret).digest("hex") !== SECRET_DIGEST) {
      return res.status(402).jsonp({
        error: "Authentication failed."
      });
    }
    if ((req.query.names == null) || req.query.names === "") {
      return res.status(403).jsonp({
        error: "Failed to parse names."
      });
    }
    args = (function() {
      var i, len, ref, results;
      ref = req.query.names.split(",");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        results.push(name);
      }
      return results;
    })();
    process = childProcess.spawn("./bin/gender/genderize", args);
    responseObject = {
      error: "An unexpected error occurred."
    };
    process.stdout.on("data", function(data) {
      return responseObject = JSON.parse(data.toString());
    });
    process.stderr.on("data", function(data) {
      return responseObject.error = data.toString();
    });
    return process.on("close", function() {
      res.status(responseObject.error != null ? 401 : 200);
      return res.jsonp(responseObject);
    });
  });

  module.exports = app;

}).call(this);
