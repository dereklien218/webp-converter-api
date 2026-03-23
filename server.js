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
    (error, stdout, stderr) => {
      if (error) {
        console.error("EXEC ERROR:", error);
        console.error("STDERR:", stderr);
        return res.status(500).send("Conversion failed");
      }

      res.download(outputPath, "converted.webp", () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    }
  );
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});