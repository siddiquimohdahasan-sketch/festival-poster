const express = require("express");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// home
app.get("/", (req, res) => {
  res.send("Poster Generator Running 🚀");
});

// health
app.get("/health", (req, res) => res.send("OK"));

app.post("/generate", upload.single("photo"), async (req, res) => {
  try {
    const name = req.body.name || "Your Name";
    const festival = req.body.festival || "Festival Wishes";

    const backgroundPath = path.join(__dirname, "assets", "festival.jpg");

    let image = sharp(backgroundPath).resize(400, 600);

    if (req.file) {
      const photoBuffer = await sharp(req.file.buffer)
        .resize(150, 150)
        .png()
        .toBuffer();

      image = image.composite([
        { input: photoBuffer, top: 150, left: 125 }
      ]);
    }

    const svgText = `
    <svg width="400" height="600">
      <text x="200" y="80" font-size="28" fill="gold" text-anchor="middle">${festival}</text>
      <text x="200" y="350" font-size="26" fill="white" text-anchor="middle">${name}</text>
      <text x="200" y="580" font-size="14" fill="white" text-anchor="middle">posterdukan.in</text>
    </svg>
    `;

    const finalImage = await image
      .composite([{ input: Buffer.from(svgText), top: 0, left: 0 }])
      .png()
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(finalImage);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating poster");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () =>
  console.log("Server running on port", PORT)
);
