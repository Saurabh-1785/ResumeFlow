import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Correct CORS Configuration
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/generate-pdf", (req, res) => {
  const { tex } = req.body;
  if (!tex) {
    return res.status(400).send("No LaTeX content provided");
  }

  const fileId = Date.now();
  const baseName = `resume_${fileId}`;
  const texFile = path.join(__dirname, `${baseName}.tex`);
  const pdfFile = path.join(__dirname, `${baseName}.pdf`);
  const logFile = path.join(__dirname, `${baseName}.log`);
  const auxFile = path.join(__dirname, `${baseName}.aux`);

  const filesToClean = [texFile, pdfFile, logFile, auxFile];
  const cleanupFiles = () => {
    console.log(`[${fileId}] Cleaning up temporary files...`);
    filesToClean.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (cleanupErr) {
        console.error(`[${fileId}] Failed to delete file ${file}:`, cleanupErr);
      }
    });
  };
  
  fs.writeFileSync(texFile, tex);
  console.log(`[${fileId}] Wrote TEX file: ${texFile}`);

  const command = `pdflatex -interaction=nonstopmode -output-directory=${__dirname} ${texFile}`;

  exec(command, (err, stdout, stderr) => {
    console.log(`[${fileId}] Ran pdflatex command.`);
    
    if (err || !fs.existsSync(pdfFile)) {
      console.error(`[${fileId}] LaTeX compilation FAILED.`);
      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf8');
        console.error(`[${fileId}] Log file content:\n${logContent}`);
        res.status(500).send(`LaTeX compilation failed. See full log below:\n\n${logContent}`);
      } else {
        console.error(`[${fileId}] stderr:\n${stderr}`);
        res.status(500).send(`LaTeX compilation failed:\n${stderr}`);
      }
      cleanupFiles();
      return;
    } 

    console.log(`[${fileId}] PDF generated successfully.`);
    fs.readFile(pdfFile, (readErr, data) => {
      if (readErr) {
        console.error(`[${fileId}] Error reading PDF file:`, readErr);
        res.status(500).send("PDF was compiled but could not be read from disk.");
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.send(data);
        console.log(`[${fileId}] Sent PDF to client.`);
      }
      cleanupFiles();
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));