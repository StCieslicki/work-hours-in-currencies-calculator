import axios from "axios";

// const url = (currency) => `http://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;

const urlTables = 'https://api.nbp.pl/api/exchangerates/tables/a/';

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
