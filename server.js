const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb+srv://azharsayzz:Azhar70@practice.3oii6lr.mongodb.net/?retryWrites=true&w=majority&appName=practice', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.json());

app.post('/api/shortUrls', async (req, res) => {
  try {
    const { fullUrl } = req.body;
    if (!fullUrl) {
      return res.status(400).json({ error: 'No URL provided' });
    }
    const shortUrl = await ShortUrl.create({ full: fullUrl });
    res.json({ originalUrl: fullUrl, shortUrl: shortUrl.short });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (!shortUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
    shortUrl.clicks++;
    await shortUrl.save();
    res.redirect(shortUrl.full);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
})

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));