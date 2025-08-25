import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// API to generate PDF
app.post("/generate-pdf", (req, res) => {
  const { tex } = req.body;

  if (!tex) {
    return res.status(400).send("No LaTeX content provided");
  }

  const fileId = Date.now();
  const texFile = path.join(__dirname, `resume_${fileId}.tex`);
  const pdfFile = path.join(__dirname, `resume_${fileId}.pdf`);

  // Write .tex file
  fs.writeFileSync(texFile, tex);

  // Compile using pdflatex
  exec(`pdflatex -interaction=nonstopmode -output-directory=${__dirname} ${texFile}`, (err) => {
    if (err) {
      console.error("LaTeX compile error:", err);
      return res.status(500).send("Error compiling LaTeX");
    }

    // Read compiled PDF
    fs.readFile(pdfFile, (err, data) => {
      if (err) {
        return res.status(500).send("PDF not generated");
      }

      // Send PDF back
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
      res.send(data);

      // Cleanup
      fs.unlinkSync(texFile);
      fs.unlinkSync(pdfFile);
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
