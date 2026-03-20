import express from "express";
import multer from "multer";
import cors from "cors";
import { execFile } from "child_process";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `${inputPath}.webp`;

  const quality = req.body.quality || "80";

  execFile(
    "gif2webp",
    ["-q", quality, "-m", "6", inputPath, "-o", outputPath],
    (error) => {
      if (error) {
        return res.status(500).send("Conversion failed");
      }

      res.download(outputPath, "converted.webp", () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    }
  );
});

app.listen(3001, () => {
  console.log("API running on port 3001");
});