"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchResults = async () => {
            try {
                const res = await api.get('/devices');
                setDevices(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-green-600" /></div>;
    if (!user) return null;

    const latest = devices[0];

    if (!latest) {
        return (
            <div className="min-h-screen pt-32 text-center px-4">
                <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Recent Scans Found</h1>
                <p className="text-gray-600 mb-8">Start by scanning your first electronic device.</p>
                <Link href="/scan" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                    Go to Scan
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/scan" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowRight className="h-4 w-4" /> Back to Scanner
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Result Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{latest.name}</h1>
                                    <p className="text-gray-500">{latest.category}</p>
                                </div>
                                <div className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
                                    latest.hazardLevel === 'High' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                )}>
                                    {latest.hazardLevel} Hazard
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-amber-600" /> Hazard Details
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{latest.classificationResults}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Recycle className="h-5 w-5 text-green-600" /> Recycling Steps
                                </h3>
                                <ul className="space-y-3">
                                    {latest.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Tips */}
                    <div className="space-y-8">
                        <div className="bg-green-900 text-white rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-6 w-6 text-green-400" /> Quick Tips
                            </h3>
                            <div className="space-y-6 text-green-100">
                                <p>Did you know? Recycling one million laptops saves the energy equivalent to the electricity used by 3,500 homes in a year.</p>
                                <div className="pt-6 border-t border-green-800">
                                    <h4 className="font-bold text-white mb-2">Sustainable Choice</h4>
                                    <p>Consider repairing or donating if the device is still functional.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/map" className="block p-6 bg-white border border-gray-200 rounded-3xl hover:border-green-500 transition-all group">
                            <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Find a Center Nearby</h3>
                            <p className="text-sm text-gray-500 mt-2">Locate verified e-waste recyclers who can safely handle this {latest.name}.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
