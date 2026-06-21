import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const analysisId = submitResponse.data.data.id;

    await new Promise(resolve => setTimeout(resolve, 5000));

    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          'x-apikey': process.env.VIRUSTOTAL_API_KEY
        }
      }
    );

    const stats = resultResponse.data?.data?.attributes?.stats;

    if (!stats) {
      return res.status(500).json({ error: 'VirusTotal analysis unavailable' });
    }

    const malicious = stats.malicious;
    const suspicious = stats.suspicious;

    res.json({
      malicious,
      suspicious
    });
  } catch (error) {
    console.error('URL Scanner API error:', error);
    res.status(500).json({ error: error.message || 'VirusTotal API failed' });
  }
});

export default router;