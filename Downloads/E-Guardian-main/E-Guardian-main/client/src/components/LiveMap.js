"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for leaflet default icon issue in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveMap({ centers }) {
    if (typeof window === 'undefined') return null;

    return (
        <div className="h-full w-full rounded-3xl overflow-hidden shadow-inner border border-gray-200">
            <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {centers.map((center, i) => (
                    <Marker key={i} position={[center.location.coordinates[1], center.location.coordinates[0]]}>
                        <Popup>
                            <div className="p-2 font-sans">
                                <h3 className="font-bold text-gray-900">{center.name}</h3>
                                <p className="text-xs text-gray-600">{center.address}</p>
                                <div className="mt-2 flex gap-1">
                                    {center.acceptedWaste.map((w, j) => (
                                        <span key={j} className="text-[8px] bg-green-100 text-green-700 px-1 rounded uppercase font-bold">{w}</span>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
