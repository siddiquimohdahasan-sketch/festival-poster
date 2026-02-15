const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const multer = require("multer");

const app = express();

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// ✅ Health check (Railway ke liye)
app.get("/health", (req, res) => res.send("OK"));

// ✅ Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Generate Poster API
app.post("/generate", upload.single("photo"), async (req, res) => {
  try {
    const name = req.body.name || "Your Name";
    const festival = req.body.festival || "Festival Wishes";

    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext("2d");

    // ✅ Background image load
    const background = await loadImage(
      path.join(__dirname, "assets", "festival.jpg")
    );

    ctx.drawImage(background, 0, 0, 400, 600);

    // overlay
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, 400, 600);

    // Festival title
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(festival, 200, 90);

    // user photo
    if (req.file) {
      const userPhoto = await loadImage(req.file.buffer);

      ctx.save();
      ctx.beginPath();
      ctx.arc(200, 225, 75, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(userPhoto, 125, 150, 150, 150);
      ctx.restore();
    }

    // name
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.font = "26px Arial";
    ctx.fillText(name, 200, 350);

    // watermark
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

// ✅ Railway PORT binding (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
