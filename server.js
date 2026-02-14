const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const multer = require("multer");

const app = express();

// ✅ Body parser (form & JSON data read karne ke liye)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route
app.get("/", (req, res) => {
  app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/health", (req, res) => res.send("OK"));


// ✅ Multer memory storage (photo upload)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Poster Generate API
app.post("/generate", upload.single("photo"), async (req, res) => {
  try {
    const name = req.body.name || "Your Name";
    const festival = req.body.festival || "Festival Wishes";

    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext("2d");

    // ✅ Background load
    const background = await loadImage(
      path.join(__dirname, "assets", "festival.jpg")
    );
    ctx.drawImage(background, 0, 0, 400, 600);

    // ✅ Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, 400, 600);

    // ✅ Festival Title
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(festival, 200, 90);

    // ✅ User Photo (if uploaded)
    if (req.file) {
      const userPhoto = await loadImage(req.file.buffer);

      // round photo mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(200, 225, 75, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(userPhoto, 125, 150, 150, 150);
      ctx.restore();
    }

    // ✅ Name
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.font = "26px Arial";
    ctx.fillText(name, 200, 350);

    // ✅ Watermark
    ctx.shadowBlur = 0;
    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("posterdukan.in", 200, 570);

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating poster");
  }
});

// ✅ Railway PORT support
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.l