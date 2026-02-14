const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/generate", upload.single("photo"), async (req, res) => {
  const { name, festival } = req.body;

  const canvas = createCanvas(400, 600);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(
    path.join(__dirname, "assets", "festival.jpg")
  );

  ctx.drawImage(background, 0, 0, 400, 600);

  // Dark overlay
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, 400, 600);

  // Festival Title
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(festival, 200, 90);

  // User Photo
  if (req.file) {
    const userPhoto = await loadImage(req.file.buffer);
    ctx.drawImage(userPhoto, 125, 150, 150, 150);
  }

  // Name
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 10;
  ctx.font = "25px Arial";
  ctx.fillText(name, 200, 350);

  // Watermark
  ctx.font = "14px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.shadowBlur = 0;
  ctx.fillText("posterdukan.in", 200, 570);

  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

