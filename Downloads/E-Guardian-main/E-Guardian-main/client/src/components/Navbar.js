"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle, ShieldAlert, MapPin, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { name: 'Scan', href: '/scan', icon: Recycle },
    { name: 'Results', href: '/results', icon: ShieldAlert },
    { name: 'Centers', href: '/map', icon: MapPin },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Recycle className="h-8 w-8 text-green-600" />
                            <span className="text-xl font-bold text-gray-900">E-Guardian</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "border-b-2 border-green-500 text-gray-900"
                                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link href="/login" className="text-gray-500 hover:text-gray-700 font-medium text-sm">Login</Link>
                                <Link
                                    href="/signup"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 font-medium">Hi, {user.name}</span>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="text-green-600 hover:text-green-700 font-bold text-sm">Admin Panel</Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm border-l pl-4 border-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
