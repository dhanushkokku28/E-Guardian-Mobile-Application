"use client";
import { useEffect, useMemo, useState } from 'react';
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    CircleAlert,
    Globe,
    Loader2,
    MapPin,
    Recycle
} from 'lucide-react';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
});

const hazardConfig = {
    High: {
        label: 'High hazard',
        pill: 'bg-rose-100 text-rose-700',
        panel: 'bg-rose-50 text-rose-700',
        ring: 'ring-rose-200/70',
        icon: AlertTriangle
    },
    Medium: {
        label: 'Medium hazard',
        pill: 'bg-amber-100 text-amber-700',
        panel: 'bg-amber-50 text-amber-700',
        ring: 'ring-amber-200/70',
        icon: CircleAlert
    },
    Low: {
        label: 'Low hazard',
        pill: 'bg-emerald-100 text-emerald-700',
        panel: 'bg-emerald-50 text-emerald-700',
        ring: 'ring-emerald-200/70',
        icon: BadgeCheck
    }
};

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
                setDevices(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    const latest = devices[0];
    const recent = useMemo(() => devices.slice(1, 4), [devices]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-12 w-12 text-emerald-600" />
            </div>
        );
    }
    if (!user) return null;

    if (!latest) {
        return (
            <div className="min-h-screen pt-32 text-center px-4">
                <Recycle className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Recent Scans Found</h1>
                <p className="text-gray-600 mb-8">Start by scanning your first device to generate results.</p>
                <Link href="/scan" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                    Go to Scan
                </Link>
            </div>
        );
    }

    const hazard = hazardConfig[latest.hazardLevel] || hazardConfig.Low;
    const HazardIcon = hazard.icon;
    const recommendations = Array.isArray(latest.recommendations) && latest.recommendations.length
        ? latest.recommendations
        : ['Recycle at an authorized e-waste center.'];
    const detectedAt = latest.createdAt
        ? new Date(latest.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Just now';

    return (
        <div className={cn(spaceGrotesk.className, "min-h-screen pt-24 pb-16 bg-slate-950 relative overflow-hidden")}>
            <div className="absolute inset-0">
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4">
                <Link href="/scan" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
                    <ArrowRight className="h-4 w-4" /> Back to Scanner
                </Link>

                <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
                    <div className="space-y-8">
                        <div className={cn(
                            "rounded-[32px] bg-white/95 border border-white/20 shadow-2xl p-8 lg:p-10 backdrop-blur",
                            "ring-1",
                            hazard.ring
                        )}>
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                                <div className="w-full lg:w-1/3">
                                    <div className="aspect-[4/5] rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                                        {latest.imageUrl ? (
                                            <img src={latest.imageUrl} alt={latest.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-center text-slate-400">
                                                <Recycle className="h-10 w-10 mx-auto mb-2" />
                                                <p className="text-sm">No image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Scan Result</p>
                                            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mt-2">{latest.name}</h1>
                                            <p className="text-slate-500 mt-2">Category: {latest.category}</p>
                                        </div>
                                        <div className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest", hazard.pill)}>
                                            {hazard.label}
                                        </div>
                                    </div>

                                    <div className="mt-8 grid sm:grid-cols-3 gap-4">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-widest text-slate-400">Status</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">{latest.status || 'Detected'}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-widest text-slate-400">Detected</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">{detectedAt}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs uppercase tracking-widest text-slate-400">Recommendation</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">Recycle safely</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="rounded-[28px] bg-white/95 border border-white/20 p-6 shadow-xl backdrop-blur">
                                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold", hazard.panel)}>
                                    <HazardIcon className="h-4 w-4" /> Findings
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900 mt-4">Hazard details</h2>
                                <p className="text-slate-600 mt-3 leading-relaxed">{latest.classificationResults}</p>
                                <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Handling checklist</p>
                                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />Power off and remove batteries if possible.</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />Store in a dry, ventilated place away from heat.</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />Do not puncture or crush the device.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="rounded-[28px] bg-white/95 border border-white/20 p-6 shadow-xl backdrop-blur">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                    <Recycle className="h-4 w-4" /> Recycling plan
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900 mt-4">Recommended next steps</h2>
                                <ul className="mt-4 space-y-3">
                                    {recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[28px] bg-white/95 border border-white/20 p-6 shadow-xl backdrop-blur">
                            <div className="flex items-center gap-3 text-slate-900">
                                <Globe className="h-5 w-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold">Impact snapshot</h3>
                            </div>
                            <p className="text-slate-500 text-sm mt-3">Each device recycled keeps heavy metals out of soil and water.</p>
                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Tip</p>
                                    <p className="mt-2 text-sm text-slate-700">If the device still works, consider donation before recycling.</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Data safety</p>
                                    <p className="mt-2 text-sm text-slate-700">Back up and factory reset before handoff.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/map" className="block rounded-[28px] bg-white/95 border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all">
                            <div className="flex items-center gap-3 text-slate-900">
                                <MapPin className="h-5 w-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold">Find a center nearby</h3>
                            </div>
                            <p className="text-sm text-slate-500 mt-3">Locate verified e-waste recyclers that accept {latest.category}.</p>
                            <div className="mt-5 inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                                View map <ArrowRight className="h-4 w-4" />
                            </div>
                        </Link>

                        {recent.length > 0 && (
                            <div className="rounded-[28px] bg-white/95 border border-white/20 p-6 shadow-xl backdrop-blur">
                                <h3 className="text-lg font-semibold text-slate-900">Recent scans</h3>
                                <div className="mt-4 space-y-3">
                                    {recent.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.category}</p>
                                            </div>
                                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", hazardConfig[item.hazardLevel]?.pill || hazardConfig.Low.pill)}>
                                                {item.hazardLevel}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
