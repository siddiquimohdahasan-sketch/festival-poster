const express = require("express");
const app = express();

// test routes
app.get("/", (req, res) => res.send("OK"));
app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
