import axios from "axios";

// const url = (currency) => `http://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;

const urlTables = 'http://api.nbp.pl/api/exchangerates/tables/a/';

const CURRENCIES = {
    USD: "USD",
    EUR: "EUR"
}

const handledCurrencies = [CURRENCIES.USD, CURRENCIES.EUR];

export class Currencies {
    private currencies: {
        currency?: string,
        date?: string,
        rate?: number
    }[] = [{}];

    constructor() {
        //@ts-ignore
        return (async () => {
            try {
                const response = await axios(urlTables, {
                    headers: {"Content-Type": "application/json"}
                });

                const {effectiveDate, rates} = response.data[0];

                const currencies = rates.filter((rate: object & { code: string}) => handledCurrencies.includes(rate.code));

                this.currencies = currencies.map((currency: any) => ({
                    currency: currency.code,
                    date: effectiveDate,
                    rate: currency.mid
                }));
            //@ts-ignore
            } catch (error) {
                //@ts-ignore
                throw new Error(error);
            }

            return this;
        })();
    }

    getUsdRate() {
        const { date, rate } = this.currencies.filter(item => item.currency === CURRENCIES.USD)[0];

        return { rate, date };
    }

    getEurRate() {
        const { date, rate } = this.currencies.filter(item => item.currency === CURRENCIES.EUR)[0];

        return { rate, date };
    }
}


// export async function getCurrencyRateFromTable() {
//
//     try {
//         const response = await axios(urlTables, {
//             headers: {"Content-Type": "application/json"}
//         });
//
//         const { effectiveDate, rates } = response.data[0];
//
//         const currencies = rates.filter(rate => handledCurrencies.includes(rate.code));
//
//         return currencies.map(currency => ({ currency: currency.code, date: effectiveDate, rate: currency.mid }));
//     } catch (error) {
//         throw new Error(error);
//     }
// }
//
// // async function getCurrencyRate(currency) {
// //     try {
// //         const response = await axios(url(currency));
// //
// //         const {effectiveDate: date, mid: rate } = response.data.rates[0];
// //
// //         return { currency: currency.toUpperCase(), date, rate };
// //     } catch (error) {
// //         throw new Error(error);
// //     }
// // }
//
// export async function getUsdRate() {
//     const { date, rate } = (await getCurrencyRateFromTable()).filter(item => item.currency === CURRENCIES.USD)[0];
//
//     return { rate, date };
// }
//
// export async function getEuroRate() {
//     const { date, rate } = (await getCurrencyRateFromTable()).filter(item => item.currency === CURRENCIES.EUR)[0];
//
//     return { rate, date };
// }

// (async () => {
//     // console.log(await getCurrencyRateFromTable());
//     // console.log(await getUsdRate());
//     // console.log(await getEuroRate());
//     const currencies = await new Currencies();
//
//     console.log(currencies.getUsdRate());
//     console.log(currencies.getEurRate());
// })();