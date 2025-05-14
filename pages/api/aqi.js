import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.AQI_API_KEY;
    // مثال: دمشق
    const city = 'Damascus';
    const url = \`https://api.waqi.info/feed/\${city}/?token=\${apiKey}\`;
    const { data } = await axios.get(url);
    const aqi = data.data.aqi;
    return res.status(200).json({ pm25: aqi });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch AQI' });
  }
}
