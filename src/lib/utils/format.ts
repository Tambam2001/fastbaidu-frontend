export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatGB(gb: number) {
    if (gb === undefined || gb === null) return '0 GB';
    return `${gb.toFixed(2)} GB`;
}

export function formatSpeed(bps: number) {
    return formatBytes(bps) + '/s';
}

export function formatETA(seconds: number) {
    if (seconds === undefined || seconds === null) return '--:--:--';
    if (seconds < 0) return 'Unknown';
    if (seconds === 0) return 'Done';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(Boolean).join(':');
}

export function formatTimeDetailed(seconds: number) {
    return formatETA(seconds);
}

export function formatDate(dateStr: string) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export function formatUSD(usd: number) {
    if (usd === undefined || usd === null) return '$0.00';
    return `$${usd.toFixed(2)}`;
}
