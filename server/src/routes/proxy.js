import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { targetUrl, method, headers, data } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'Target URL is required' });
    }

    // Validate URL
    new URL(targetUrl);

    const response = await axios({
      method: method || 'POST',
      url: targetUrl,
      headers: { 'Content-Type': 'application/json', ...headers },
      data,
      timeout: 30000,
      validateStatus: () => true
    });

    res.json({
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      responseBody: response.data
    });
  } catch (err) {
    if (err.code === 'ERR_INVALID_URL') {
      return res.status(400).json({ success: false, error: 'Invalid URL' });
    }
    next(err);
  }
});

export default router;
