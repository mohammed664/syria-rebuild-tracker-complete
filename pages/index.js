import dynamic from 'next/dynamic';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home({ initialStats, weather, aqi }) {
  const [stats, setStats] = useState(initialStats);
  const [governorate, setGovernorate] = useState('All');
  const governorates = ['All', 'Aleppo', 'Damascus', 'Homs', 'Idlib', 'Deir ez-Zor', 'Raqqa', 'Rural Damascus', 'Daraa'];

  useEffect(() => {
    const fetchStats = async () => {
      const url = governorate === 'All'
        ? `${process.env.HOST}/api/stats`
        : `${process.env.HOST}/api/stats?gov=${encodeURIComponent(governorate)}`;
      const res = await axios.get(url);
      setStats(res.data);
    };
    fetchStats();
  }, [governorate]);

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-blue-600 text-white text-xl">GIS Reconstruction Tracker</header>
      <main className="flex-1 flex">
        <div className="w-3/4 flex flex-col">
          <div className="p-4 bg-gray-100">
            <label className="mr-2 font-semibold">Filter by Governorate:</label>
            <select value={governorate} onChange={e => setGovernorate(e.target.value)} className="border rounded p-1">
              {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
            </select>
          </div>
          <Map governorate={governorate} />
        </div>
        <aside className="w-1/4 p-4 bg-white overflow-y-auto">
          <h2 className="font-bold mb-2">Statistics</h2>
          <p><strong>Governorate:</strong> {governorate}</p>
          <p><strong>Total Damaged Buildings:</strong> {stats.damagedBuildings.total.toLocaleString()}</p>
          <p><strong>Fully Destroyed:</strong> {stats.damagedBuildings.fullyDestroyed.toLocaleString()}</p>
          <p><strong>Severely Damaged:</strong> {stats.damagedBuildings.severelyDamaged.toLocaleString()}</p>
          <p><strong>Debris Volume:</strong> {stats.debrisVolume ? stats.debrisVolume + ' tons' : 'Data not available'}</p>
          <p><strong>Estimated Reconstruction Cost:</strong></p>
          <ul className="list-disc ml-5">
            <li>Min: ${stats.fundingNeedsBySector.totalCostEstimate.min.toLocaleString()} M</li>
            <li>Max: ${stats.fundingNeedsBySector.totalCostEstimate.max.toLocaleString()} M</li>
          </ul>
          <hr className="my-4" />
          <p><strong>Temperature:</strong> {weather.temp}°C</p>
          <p><strong>Air Quality (PM2.5):</strong> {aqi.pm25}</p>
        </aside>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
    const base = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
    const statsRes = await axios.get(`${base}/api/stats`);
    const weatherRes = await axios.get(`${base}/api/weather`);
    const aqiRes = await axios.get(`${base}/api/aqi`);
    return { props: { stats: statsRes.data, weather: weatherRes.data, aqi: aqiRes.data } };
}
