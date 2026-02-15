"use client";
import { useState, useEffect } from 'react';
import { Camera, Loader2, Upload, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ScanPage() {
    const [deviceName, setDeviceName] = useState('');
    const [category, setCategory] = useState('Smartphone');
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/devices/classify', {
                name: deviceName,
                category: category,
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop'
            });
            router.push('/results');
        } catch (err) {
            console.error(err);
            alert('Scanning failed. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-green-600" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Identify Your Waste</h1>
                        <p className="text-gray-600 mb-8">Upload an image or manually enter device details to get an e-waste analysis.</p>

                        <form onSubmit={handleScan} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
                                    <input
                                        type="text"
                                        value={deviceName}
                                        onChange={(e) => setDeviceName(e.target.value)}
                                        placeholder="e.g. iPhone 12, Laptop Battery"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option>E-waste</option>
                                        <option>Plastic</option>
                                        <option>Metal</option>
                                        <option>Glass</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-green-500 transition-colors group cursor-pointer">
                                <div className="flex flex-col items-center">
                                    <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
                                    <p className="text-gray-400 text-sm mt-2">JPG, PNG or GIF (max. 10MB)</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Camera className="h-5 w-5" />}
                                {loading ? 'Analyzing...' : 'Start Analysis'}
                            </button>
                        </form>

                        <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p>Warning: If the device is leaking or has a bloated battery, do not attempt to scan manually. Please take it immediately to a hazardous waste facility.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
