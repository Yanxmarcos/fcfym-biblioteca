'use client';
import { usePathname } from 'next/navigation';
import Footer from "./Footer";
export default function DynamicFooter() {
    const pathname = usePathname();
    if (pathname?.includes('/biblioteca')) {
        return null;
    }
    if (pathname?.includes('/mi-cuenta')) {
        return null;
    }
    return <Footer />;
}
