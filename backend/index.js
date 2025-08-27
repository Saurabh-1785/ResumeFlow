import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";   // <-- you forgot to import

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

  fs.writeFileSync(texFile, tex);

  // Run pdflatex and capture full stderr
  exec(`pdflatex -interaction=nonstopmode -output-directory=${__dirname} ${texFile}`, (err, stdout, stderr) => {
    if (err) {
      console.error("LaTeX compile error:", stderr);  // 👈 show real latex log
      return res.status(500).send(`LaTeX error:\n${stderr}`);
    }

    fs.readFile(pdfFile, (err, data) => {
      if (err) {
        return res.status(500).send("PDF not generated");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
      res.send(data);

      // Cleanup
      fs.unlinkSync(texFile);
      fs.unlinkSync(pdfFile);
      fs.unlinkSync(texPath);
      fs.unlinkSync(path.join(__dirname, "resume.log")); // delete log
      fs.unlinkSync(path.join(__dirname, "resume.aux")); // delete aux

    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
