import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function isValidDNI(dni: string): boolean {
    return /^[0-9]{8}$/.test(dni);
}
