childProcess = require "child_process"
crypto = require "crypto"
express = require "express"
app = express()

SECRET_DIGEST = "65eb608c22cff0e6c4a4bef0aa04eae4e3cc6e9c42adf53965a26a57e584c7be"

app.use express.static("public")

app.get "/about", (req, res) ->
    res.sendFile("about.html", {root: "./public"})

app.get "/", (req, res) ->
    res.sendFile("index.html", {root: "./public"})

app.get "/gender", (req, res) ->
    res.setHeader "Content-Type", "application/json"
    sha = crypto.createHash "sha256"
    if !req.query.secret? or sha.update(req.query.secret).digest("hex") != SECRET_DIGEST
        return res.status(402).jsonp { error: "Authentication failed." }

    if !req.query.names? or req.query.names == ""
        return res.status(403).jsonp { error: "Failed to parse names." }

    args = ["bin/gender/genderize.py"]
    args.push(name) for name in req.query.names.split(",")
    process = childProcess.spawn "python", args
    responseObject = { error: "An unexpected error occurred." }
    process.stdout.on "data", (data) -> responseObject = JSON.parse data.toString()
    process.stderr.on "data", (data) -> responseObject.error = data.toString()
    process.on "close", () ->
        res.status(if responseObject.error? then 401 else 200)
        res.jsonp responseObject

module.exports = app
