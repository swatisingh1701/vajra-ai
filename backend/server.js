import cors from "cors";
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/backend', express.static(path.join(__dirname, 'backend')));

app.use('/api', express.Router());

import medhaRoute from './routes/medha.js';
import phishingRoute from './routes/phishing.js';
import urlScannerRoute from './routes/urlscanner.js';
import ipLookupRoute from './routes/iplookup.js';

app.use('/api/medha', medhaRoute);
app.use('/api/phishing', phishingRoute);
app.use('/api/urlscanner', urlScannerRoute);
app.use('/api/iplookup', ipLookupRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});