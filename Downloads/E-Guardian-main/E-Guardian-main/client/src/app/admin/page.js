"use client";
import { useEffect, useState } from 'react';
import { Database, Shield, AlertCircle, Trash2, Users, Plus, X } from 'lucide-react';
import api from '@/lib/api';

export default function AdminPage() {
    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newHazard, setNewHazard] = useState({ component: '', classification: '', hazardDescription: '', disposalGuide: '' });

    useEffect(() => {
        fetchHazards();
    }, []);

    const fetchHazards = async () => {
        try {
            const res = await api.get('/hazards');
            setHazards(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHazard = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hazards', newHazard);
            setShowModal(false);
            setNewHazard({ component: '', classification: '', hazardDescription: '', disposalGuide: '' });
            fetchHazards();
        } catch (err) {
            alert('Failed to add hazard');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
                        <p className="text-gray-600">Manage hazard datasets and monitor system analytics.</p>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors">
                        <Database className="h-4 w-4" /> Export Datasets
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { label: 'Hazards Database', icon: Shield, active: true },
                            { label: 'User Analytics', icon: Users },
                            { label: 'System Logs', icon: AlertCircle },
                            { label: 'Manage Centers', icon: Trash2 },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-left font-bold transition-all ${item.active ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                <item.icon className="h-5 w-5" /> {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 text-xl">Hazard Classification Records</h3>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4" /> Add New Component
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                        <tr>
                                            <th className="px-8 py-4">Component</th>
                                            <th className="px-8 py-4">Hazard Detail</th>
                                            <th className="px-8 py-4">Classification</th>
                                            <th className="px-8 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Retrieving records...</td></tr>
                                        ) : hazards.map((h, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-5 font-bold text-gray-900">{h.component}</td>
                                                <td className="px-8 py-5 text-gray-600 text-sm">{h.hazardDescription}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${h.classification === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {h.classification}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add Hazard Record</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddHazard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Component Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    value={newHazard.component}
                                    onChange={(e) => setNewHazard({ ...newHazard, component: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Classification</label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        value={newHazard.classification}
                                        onChange={(e) => setNewHazard({ ...newHazard, classification: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Hazard Description</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-24"
                                    value={newHazard.hazardDescription}
                                    onChange={(e) => setNewHazard({ ...newHazard, hazardDescription: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Disposal Guide</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-24"
                                    value={newHazard.disposalGuide}
                                    onChange={(e) => setNewHazard({ ...newHazard, disposalGuide: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                Post to Database
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
