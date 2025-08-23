import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ServiceMapProps {
  workerLocation?: { lng: number; lat: number };
  destination?: { lng: number; lat: number };
  destinationAddress?: string;
}

const ServiceMap = ({ 
  workerLocation = { lng: 114.0579, lat: 22.5431 }, // Default to Shenzhen
  destination = { lng: 114.0579, lat: 22.5431 },
  destinationAddress = ""
}: ServiceMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const workerMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken) {
      console.warn('VITE_MAPBOX_TOKEN not found in environment variables');
      return;
    }

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 13,
      center: [destination.lng, destination.lat],
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Create worker marker (blue)
    workerMarker.current = new mapboxgl.Marker({ 
      color: '#3B82F6',
      scale: 0.8 
    })
      .setLngLat([workerLocation.lng, workerLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<div class="text-sm font-medium">我的位置</div>'))
      .addTo(map.current);

    // Create destination marker (red)
    destinationMarker.current = new mapboxgl.Marker({ 
      color: '#EF4444',
      scale: 1 
    })
      .setLngLat([destination.lng, destination.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<div class="text-sm font-medium">服务地址<br/><span class="text-muted-foreground">${destinationAddress}</span></div>`))
      .addTo(map.current);

    // Fit bounds to show both markers
    const bounds = new mapboxgl.LngLatBounds()
      .extend([workerLocation.lng, workerLocation.lat])
      .extend([destination.lng, destination.lat]);
    
    map.current.fitBounds(bounds, { 
      padding: 60,
      maxZoom: 15 
    });

    // Cleanup
    return () => {
      workerMarker.current?.remove();
      destinationMarker.current?.remove();
      map.current?.remove();
    };
  }, [workerLocation, destination, destinationAddress]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-foreground">地图配置缺失</p>
          <p className="text-sm text-muted-foreground mt-1">
            请在 .env 文件中配置 VITE_MAPBOX_TOKEN
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default ServiceMap;