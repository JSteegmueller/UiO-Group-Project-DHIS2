export const date = new Date();

export const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

export function getNextRestock() {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nDate = new Date(date.getFullYear(), date.getMonth() + (date.getDate() < 15 ? 0 : 1), 14);
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - nDate) / oneDay));
}

export function getLastRecount(lastDate) {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const lDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - lDate) / oneDay));
}
