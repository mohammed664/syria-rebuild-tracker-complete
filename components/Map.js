import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [37.0, 35.0], // مركز سوريا
      zoom: 6
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="w-3/4 h-full" />;
}
