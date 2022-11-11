function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

function getTimeDiff(date) {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nDate = new Date(date.getFullYear(), date.getMonth() + (date.getDate() < 15 ? 0 : 1), 14);
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - nDate) / oneDay));
}

export const date = new Date();

const pDate = new Date(date);
pDate.setDate(0);

export const nextRestock = getTimeDiff(date);

export const currentPeriod = getPeriod(date);

export const previousPeriod = getPeriod(pDate);
