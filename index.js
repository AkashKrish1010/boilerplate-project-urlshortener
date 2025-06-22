const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlDatabase = {};
let counter = 1;

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/shorturl", function (req, res) {
  const org_url = req.body.url;

  try {
    const parsed = new URL(org_url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return res.json({ error: "invalid url" }); 
    }

    const short_url = counter++;
    urlDatabase[short_url] = org_url;

    res.json({ original_url: org_url, short_url: short_url });
  } catch (error) {
    res.json({ error: "invalid url" }); 
  }
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = req.params.short_url;

  const originalUrl = urlDatabase[short_url];
  if (!originalUrl) {
    return res.json({ error: "invalid url" }); 
  }

  res.redirect(originalUrl);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
