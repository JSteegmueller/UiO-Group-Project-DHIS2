function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

function getNextRestock(date) {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nDate = new Date(date.getFullYear(), date.getMonth() + (date.getDate() < 15 ? 0 : 1), 14);
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - nDate) / oneDay));
}

const pDate = new Date();
pDate.setDate(0);

export const date = new Date();

export const currentPeriod = getPeriod(date);

export const previousPeriod = getPeriod(pDate);

export const nextRestock = getNextRestock(date);

export function getLastRecount(lastDate) {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const lDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - lDate) / oneDay));
}
