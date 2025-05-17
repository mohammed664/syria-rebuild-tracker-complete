// pages/index.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
    const [stats, setStats] = useState(null);
    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [s, w, a] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/weather'),
                    axios.get('/api/aqi'),
                ]);
                setStats(s.data);
                setWeather(w.data);
                setAqi(a.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load data');
            }
        }
        fetchData();
    }, []);

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }
    if (!stats || !weather || !aqi) {
        return <div className="p-4">Loading…</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="p-4 bg-blue-600 text-white text-xl">GIS Reconstruction Tracker</header>
            <main className="flex-1 flex">
                <Map />
                <aside className="w-1/4 p-4 bg-white overflow-y-auto">
                    <h2 className="font-bold mb-2">Statistics</h2>
                    <p><strong>Total Damaged Buildings:</strong> {stats.damagedBuildings.total.toLocaleString()}</p>
                    <p><strong>Fully Destroyed:</strong> {stats.damagedBuildings.fullyDestroyed.toLocaleString()}</p>
                    <p><strong>Severely Damaged:</strong> {stats.damagedBuildings.severelyDamaged.toLocaleString()}</p>
                    <p><strong>Debris Volume:</strong> {stats.debrisVolume ? stats.debrisVolume + ' tons' : 'Data not available'}</p>
                    <h2 className="font-bold mt-4 mb-2">Reconstruction Cost Estimates</h2>
                    <p>Min: ${stats.fundingNeedsBySector.totalCostEstimate.min.toLocaleString()} M</p>
                    <p>Max: ${stats.fundingNeedsBySector.totalCostEstimate.max.toLocaleString()} M</p>
                    <hr className="my-4" />
                    <h2 className="font-bold mb-2">Environment</h2>
                    <p><strong>Temperature:</strong> {weather.temp}°C</p>
                    <p><strong>AQI (PM2.5):</strong> {aqi.pm25}</p>
                </aside>
            </main>
        </div>
    );
}
