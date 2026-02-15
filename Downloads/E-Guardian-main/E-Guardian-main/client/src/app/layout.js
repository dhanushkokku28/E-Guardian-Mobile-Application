import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
    title: "E-Guardian | Smart Waste & Hazard Detection",
    description: "AI-powered waste detection and recycling recommendation system.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <body className="antialiased bg-white text-gray-900">
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <footer className="bg-gray-50 border-t border-gray-200 py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <p className="text-gray-500 text-sm">
                                &copy; {new Date().getFullYear()} E-Guardian. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
