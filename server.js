import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.post("/generate", upload.array("images"), async (req, res) => {
  const files = req.files;
  const results = [];

  const prompt =
    "ultra detailed anime art, 8K masterpiece, soft glowing light, dynamic lighting, stunning vibrant color, anime style portrait, expressive face, glossy eyes, stylish pose, detailed outfit, fantasy background, by Makoto Shinkai and KyoAni, breathtakingly beautiful";

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(file.path));
    formData.append("prompt", prompt);
    formData.append("mode", "image-to-image");
    formData.append("strength", "0.6");
    formData.append("output_format", "png");

    try {
      const response = await fetch("https://api.stability.ai/v2beta/image-to-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_KEY}`,
          Accept: "image/*"
        },
        body: formData
      });

      if (!response.ok) throw new Error(await response.text());
      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = `hasil_${Date.now()}_${file.originalname}.png`;
      fs.writeFileSync(filename, buffer);
      const base64 = buffer.toString("base64");
      results.push(`data:image/png;base64,${base64}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
      results.push(`ERROR: ${err.message}`);
    } finally {
      fs.unlinkSync(file.path);
    }
  }

  res.json({ images: results });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
