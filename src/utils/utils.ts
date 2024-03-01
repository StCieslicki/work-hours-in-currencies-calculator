import {CurrenciesList} from "./currencies";

export function shortendNumber(value: number, fixed: number = 2): number {
    return Number(value.toFixed(fixed));
}

export function shortendNumbers(currencies: CurrenciesList, fixed: number = 2): CurrenciesList {
    const result = {};

    for (const key in currencies) {
        // @ts-ignore
        result[key] = shortendNumber(currencies[key], fixed);
    }

    return result;
}

export function createYearList(year: number, delta: number = 2) {
    const result = [];

    for (let i = year - delta; i <= year + delta; i++) {
        result.push(i);
    }

    return result;
}
