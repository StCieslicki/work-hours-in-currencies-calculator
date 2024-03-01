import {CurrenciesList} from "./currencies";

export function shortendNumber(value: number, fixed: number = 2): number {
    return Number(value.toFixed(fixed));
}

export function shortendNumbers(currencies: CurrenciesList, fixed: number = 2): CurrenciesList {
    const result = {};

    for (const key in currencies) {
        result[key] = shortendNumber(currencies[key], fixed);
    }

    return result;
}
