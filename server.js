import express from 'express';
import cors from 'cors';
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Helper to run SSH commands
const runSSHCommand = (config, command) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      let output = '';
      conn.exec(command, (err, stream) => {
        if (err) return reject(err);
        stream.on('close', (code, signal) => {
          conn.end();
          resolve(output);
        }).on('data', (data) => {
          output += data.toString();
        }).stderr.on('data', (data) => {
          console.error('STDERR: ' + data);
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect(config);
  });
};

// Connect and list users (mac addresses)
app.post('/api/list-users', async (req, res) => {
  const { host, username, password } = req.body;
  try {
    const output = await runSSHCommand({ host, username, password, port: 22 }, 'ls -1 /tmp/ScreenShort/');
    const users = output.split('\n').filter(Boolean);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List dates for a specific user
app.post('/api/list-dates', async (req, res) => {
  const { host, username, password, userPath } = req.body;
  try {
    const output = await runSSHCommand({ host, username, password, port: 22 }, `ls -1 /tmp/ScreenShort/${userPath}/`);
    const dates = output.split('\n').filter(Boolean);
    res.json({ dates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List images for a specific date
app.post('/api/list-images', async (req, res) => {
  const { host, username, password, userPath, date } = req.body;
  try {
    const output = await runSSHCommand({ host, username, password, port: 22 }, `ls -1 /tmp/ScreenShort/${userPath}/${date}/`);
    const images = output.split('\n').filter(Boolean);
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch image data (base64)
app.post('/api/get-image', async (req, res) => {
  const { host, username, password, imagePath } = req.body;
  try {
    const conn = new Client();
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) {
          conn.end();
          return res.status(500).json({ error: err.message });
        }
        const fullPath = `/tmp/ScreenShort/${imagePath}`;
        sftp.readFile(fullPath, (err, buffer) => {
          conn.end();
          if (err) return res.status(500).json({ error: err.message });
          const base64 = buffer.toString('base64');
          const ext = path.extname(fullPath).toLowerCase().replace('.', '');
          res.json({ data: `data:image/${ext || 'png'};base64,${base64}` });
        });
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
    }).connect({ host, username, password, port: 22 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
