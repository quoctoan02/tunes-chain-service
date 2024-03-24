import crypto from "crypto";
// --- Create password validator schema
const trimText = (str: string): string => {
    return str.trim().replace(/\s\s+/g, ' ')
}

const arrayToMap = (array: any[], key: string) => {
    const map = new Map()
    for (const item of array) {
        map.set(item[key], item)
    }
    return map
}

// --- Normalized number
const normalizeNumber = (num: number) => {
    return Number(num.toFixed(8));
};

const sha256 = (str: string) => {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateCode = (length: number = 6) => {
    const set = '0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
        const p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};
const generateString = (length: number = 6) => {
    const set = '0123456789abcdefghijklmnoporstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let salt = '';
    for (let i = 0; i < length; i++) {
        const p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const calPoint = (configPoint: any, metric: any) => {
    let point = 0;
    Object.keys(configPoint).forEach(key => {
        if (metric[`${key}_count`]) {
            point += Number(metric[`${key}_count`]) * Number(configPoint[key]);
        }
    })
    return point;
}

const randomWithPercentage = (data: any) => {
    const expanded = data.flatMap((item: any) => Array(Number(item.rate)).fill(item));
    return expanded[Math.floor(Math.random() * expanded.length)];
}

export const Utils = {
    trimText,
    arrayToMap,
    normalizeNumber,
    sha256,
    getRandomInt,
    generateCode,
    generateString,
    sleep,
    calPoint,
    randomWithPercentage
}
