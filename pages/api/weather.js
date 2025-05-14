import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    // مثال: دمشق، سوريا
    const city = 'Damascus,sy';
    const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&units=metric&appid=\${apiKey}\`;
    const { data } = await axios.get(url);
    return res.status(200).json({
      temp: data.main.temp,
      description: data.weather[0].description
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch weather' });
  }
}
