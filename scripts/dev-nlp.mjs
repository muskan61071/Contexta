import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const nlpDir = path.join(rootDir, 'nlp-engine');

// Detect Python binary: Windows venv, Unix venv, or system python
const winVenv = path.join(nlpDir, '.venv', 'Scripts', 'python.exe');
const unixVenv = path.join(nlpDir, '.venv', 'bin', 'python');

let pythonBin = 'python';
if (fs.existsSync(winVenv)) {
  pythonBin = winVenv;
} else if (fs.existsSync(unixVenv)) {
  pythonBin = unixVenv;
}

const child = spawn(pythonBin, ['-m', 'uvicorn', 'app.main:app', '--port', '8000', '--reload'], {
  cwd: nlpDir,
  stdio: 'inherit',
  shell: false
});

child.on('error', (err) => {
  console.error('[NLP Runner] Failed to start NLP engine:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
