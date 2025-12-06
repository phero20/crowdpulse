"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Only show Navbar on home page
    if (pathname === '/') {
        return <Navbar />;
    }

    return null;
}
