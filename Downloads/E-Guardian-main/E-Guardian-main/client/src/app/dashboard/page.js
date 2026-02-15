"use client";
import { useEffect, useState } from 'react';
import { BarChart3, Recycle, ShieldAlert, Leaf, History, TrendingUp, LayoutDashboard, Zap, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const data = [
    { name: 'Mon', count: 2 },
    { name: 'Tue', count: 5 },
    { name: 'Wed', count: 3 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 4 },
    { name: 'Sat', count: 12 },
    { name: 'Sun', count: 6 },
];

export default function DashboardPage() {
    const [stats, setStats] = useState({ totalDevices: 0, highHazardDevices: 0, co2Saved: 0 });
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
        const fetchData = async () => {
            try {
                const [statsRes, devicesRes] = await Promise.all([
                    api.get('/devices/stats'),
                    api.get('/devices')
                ]);
                setStats(statsRes.data);
                setDevices(devicesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Environmental Impact Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Devices Scanned', value: stats?.totalDevices || 0, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'CO2 Saved (kg)', value: stats?.co2Saved || 0, icon: Leaf, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'High Hazard Found', value: stats?.highHazardDevices || 0, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
                        { label: 'Impact Score', value: '780', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className={`p-3 rounded-xl inline-block mb-4 ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Weekly Activity */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-600" /> Weekly Activity
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <History className="h-5 w-5 text-green-600" /> Recent Scans
                        </h3>
                        <div className="space-y-6">
                            {devices.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${item.hazardLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {item.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.hazardLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.hazardLevel}
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && <p className="text-gray-400 text-sm">No recent activity.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
