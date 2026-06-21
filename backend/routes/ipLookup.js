import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:ip', async (req, res) => {
  try {
    const ip = req.params.ip;

    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const response = await axios.get(
      `https://ipinfo.io/${ip}/json`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.IPINFO_API_KEY}`
        }
      }
    );

    const data = response.data;

    if (!data || data.error) {
      return res.status(404).json({ status: 404, error: 'Invalid IP address' });
    }

    res.json({
      country: data.country || 'Unavailable',
      region: data.region || 'Unavailable',
      city: data.city || 'Unavailable',
      org: data.org || 'Unavailable',
      timezone: data.timezone || 'Unavailable'
    });
  } catch (error) {
    console.error('IP Lookup API error:', error);
    res.status(500).json({ status: 500, error: 'Lookup failed' });
  }
});

export default router;