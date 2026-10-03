export function decodeToken<T>(token: string): T | null {
    try {
        const payload = token.split(".")[1];
        if (!payload)
            return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        return JSON.parse(atob(padded)) as T;
    }
    catch {
        return null;
    }
}
