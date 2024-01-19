import axios from "axios";

const url = (currency) => `http://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;

async function getCurrencyRate(currency) {
    try {
        const response = await axios(url(currency));

        const {effectiveDate: date, mid: rate } = response.data.rates[0];

        return { currency: currency.toUpperCase(), date, rate };
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUsdRate() {
    const { date, rate } = await getCurrencyRate('usd');

    return { rate, date };
}

export async function getEuroRate() {
    const { date, rate } = await getCurrencyRate('eur');

    return { rate, date };
}