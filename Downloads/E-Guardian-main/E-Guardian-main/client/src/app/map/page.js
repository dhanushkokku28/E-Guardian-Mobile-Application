"use client";
import { useEffect, useState } from 'react';
import { MapPin, Phone, Star, Search, Filter } from 'lucide-react';
import api from '@/lib/api';

export default function MapPage() {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await api.get('/centers');
                setCenters(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCenters();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Nearby Recycling Centers</h1>
                        <p className="text-gray-600">Verified facilities that handle electronics, batteries, and other hazards.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search location..."
                                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <Filter className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {loading ? (
                            <p>Loading centers...</p>
                        ) : centers.length === 0 ? (
                            <p>No centers found.</p>
                        ) : centers.map((center, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                                <h3 className="font-bold text-gray-900 group-hover:text-green-600 mb-2">{center.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" /> {center.address}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {center.acceptedWaste.map((tag, j) => (
                                        <span key={j} className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                        <Star className="h-4 w-4 fill-current" /> {center.rating}
                                    </div>
                                    <a href={`tel:${center.contact}`} className="text-sm text-green-600 flex items-center gap-1 font-medium">
                                        <Phone className="h-4 w-4" /> Contact
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map Section (Live) */}
                    <div className="lg:col-span-2 relative min-h-[500px]">
                        <DynamicMap centers={centers} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Client-side only import for Leaflet
import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('@/components/LiveMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center text-gray-400 font-bold">Initializing Orbital Map...</div>
});
