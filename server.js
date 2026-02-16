const express = require("express");
const path = require("path");

const app = express();

// static files
app.use(express.static(path.join(__dirname, "public")));

// test route
app.get("/", (req, res) => {
  res.send("Poster Server Running 🚀");
});

// health check
app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
