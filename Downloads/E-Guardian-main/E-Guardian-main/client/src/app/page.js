"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recycle, ShieldAlert, Zap, MapPin, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const ImpactStats = () => {
    const [stats, setStats] = useState({ totalDevices: 1240, co2Saved: 3100, highHazardDevices: 450 });

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const res = await api.get('/devices/stats');
                if (res.data) setStats(res.data);
            } catch (err) {
                // Fallback to mock if API fails
            }
        };
        fetchGlobalStats();
    }, []);

    return (
        <div className="bg-green-600 py-20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold mb-12">Global Environmental Impact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    <div>
                        <div className="text-5xl font-black mb-2">{stats.totalDevices}+</div>
                        <p className="text-green-100 font-medium">Scans Performed</p>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2">{stats.co2Saved}kg</div>
                        <p className="text-green-100 font-medium">CO₂ Prevented</p>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2">{stats.highHazardDevices}</div>
                        <p className="text-green-100 font-medium">Hazards Contained</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    return (
        <div className="flex flex-col gap-0 pt-16">
            {/* Hero */}
            <div className="bg-white py-20 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Smart Waste Detection & <span className="text-green-600">Hazard Analysis</span>
                    </h1>
                    <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Protect the environment and your health. Scan devices, identify hazards, and find the nearest recycling centres with AI-powered insights.
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <Link
                            href="/scan"
                            className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-2xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-200 flex items-center gap-2"
                        >
                            Scan Waste Now <Recycle className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/map"
                            className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 text-lg font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center gap-2"
                        >
                            Find Centers <MapPin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'AI Detection', desc: 'Upload images to automatically identify device types and potential hazards.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                            { title: 'Hazard Analysis', desc: 'Detailed breakdown of toxic components and safe handling guides.', icon: ShieldAlert, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { title: 'Smart Recycling', desc: 'Get personalized recommendations and locate nearby verified centers.', icon: Recycle, color: 'text-green-500', bg: 'bg-green-50' },
                        ].map((feature, i) => (
                            <div key={i} className="text-center group p-8 rounded-3xl hover:bg-gray-50 transition-all">
                                <div className={cn("mx-auto h-16 w-16 mb-6 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", feature.bg)}>
                                    <feature.icon className={cn("h-8 w-8", feature.color)} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ImpactStats />

            {/* Final CTA */}
            <div className="bg-white py-32">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-6 italic">Did you know?</h2>
                    <p className="text-xl text-gray-600 mb-12">
                        "Over 50 million metric tons of e-waste is produced annually. Only 20% is formally recycled. Together, we can change that."
                    </p>
                    <Link href="/signup" className="text-green-600 font-bold text-lg hover:underline underline-offset-8 decoration-2">
                        Become an E-Guardian Today &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
