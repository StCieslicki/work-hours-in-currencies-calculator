"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../../components/error";
import {getFreeDaysCount, getWorkingDays, getYearDaysCount} from "../../utils/holidays";
import {Currencies } from "../../utils/currencies";
import {Row} from "../../components/row";
import {Input} from "../../components/input";

// interface CurrenciesList {
//     pln: number,
//     usd: number,
//     eur: number
// }

interface CurrenciesList {
    [key: string]: number,
}


export default function Home() {
    const currentYear = new Date().getFullYear();

    const defaults = {
        nonVatRate: 1,
        vatRate: 1.23,
        defaultHourRate: 120,
        defaultHourPerDay: 8,

        defaltAvgDayPerMonth: 22,
        daysInYear: getYearDaysCount(currentYear),
        workingDays: getWorkingDays(currentYear),
        freeDays: getFreeDaysCount(currentYear),
        defaultPayedLeaveDays: 0,

        fixedToForLarge: 0,
        fixedToForSmall: 2,
    }

    const [error, setError] = useState('');

    const [currencyDate, setCurrencyDate]: [string, Function] = useState('');
    const [rates, setRates]: [CurrenciesList, Function] = useState({ pln: 1, usd: 0, eur: 0 });

    const [hourPerDay, setHourPerDay]: [number, Function] = useState(defaults.defaultHourPerDay);

    const [nettoBruttoRate, setNettoBruttoRate]: [number, Function] = useState(defaults.nonVatRate);

    const [year, setYear]: [number, Function] = useState(currentYear);
    const [daysInYear, setDaysInYear]: [number, Function] = useState(defaults.daysInYear);
    const [workingDays, setWorkingDays]: [number, Function] = useState(defaults.workingDays);
    const [freeDays, setFreeDays]: [number, Function] = useState(defaults.freeDays);
    const [payedLeaveDays, setPayedLeaveDays]: [number, Function] = useState(defaults.defaultPayedLeaveDays);

    const [avgDayPerMonth, setAvgDayPerMonth]: [number, Function] = useState(defaults.defaltAvgDayPerMonth);

    // const [hourRatePln, setHourRatePln]: [number, Function] = useState(defaults.defaultHourRate);
    // const [hourRateUsd, setHourRateUsd]: [number, Function] = useState(0);
    // const [hourRateEur, setHourRateEur]: [number, Function] = useState(0);

    const [hourlyRates, setHourlyRates]: [CurrenciesList, Function] = useState({ pln: defaults.defaultHourRate, usd: 0, eur: 0 });

    const [yearlyIncomePln, setYearlyIncomePln]: [number, Function] = useState(0);
    const [yearlyIncomeUsd, setYearlyIncomeUsd]: [number, Function] = useState(0);
    const [yearlyIncomeEur, setYearlyIncomeEur]: [number, Function] = useState(0);

    const [yearlyIncomes, setYearlyIncomes]: [CurrenciesList, Function] = useState({ pln: 0, usd: 0, eur: 0 });

    const [monthlyIncomePln, setMonthlyIncomePln]: [number, Function] = useState(0);
    const [monthlyIncomeUsd, setMonthlyIncomeUsd]: [number, Function] = useState(0);
    const [monthlyIncomeEur, setMonthlyIncomeEur]: [number, Function] = useState(0);

    const [monthlyIncomes, setMonthlyIncomes]: [CurrenciesList, Function] = useState({ pln: 0, usd: 0, eur: 0 });

    function shortendNumber(value: number, fixed: number = defaults.fixedToForSmall): number {
        return Number(value.toFixed(fixed));
    }

    function recalculateCurrencies(currencies: Partial<CurrenciesList>, rates: CurrenciesList): CurrenciesList {
        const key = Object.keys(currencies)[0];
        const value = Object.values(currencies)[0];

        if (rates[key]) {
            const pln = shortendNumber(value * rates[key] / rates.pln);
            const usd = shortendNumber(value * rates[key] / rates.usd);
            const eur = shortendNumber(value * rates[key] / rates.eur);

            return { pln, usd, eur }
        }

        throw new Error(`No rates for currency: ${key}`);

        // const { pln: currentPln, usd: currentUsd, eur: currentEur } = currencies;
        //
        // let pln: number, usd: number, eur: number;
        // let recalculated: CurrenciesList;
        //
        // if (currentPln) {
        //     pln = shortendNumber(currentPln * rates.pln / rates.pln);
        //     usd = shortendNumber(currentPln * rates.pln / rates.usd);
        //     eur = shortendNumber(currentPln * rates.pln / rates.eur);
        // } else if (currentUsd) {
        //     usd = shortendNumber(currentUsd * rates.usd / rates.usd);
        //     pln = shortendNumber(currentUsd * rates.usd / rates.pln);
        //     eur = shortendNumber(currentUsd * rates.usd / rates.eur);
        // } else if (currentEur) {
        //     eur = shortendNumber(currentEur * rates.eur / rates.eur);
        //     pln = shortendNumber(currentEur * rates.eur / rates.pln);
        //     usd = shortendNumber(currentEur * rates.eur / rates.usd);
        // }

        // recalculated = { pln, usd, eur };
        //
        // return recalculated;
    }

    useEffect( () => {
        let rates: CurrenciesList;

        (async () => {
            const currencies = await new Currencies();

            const usdRate = currencies.getUsdRate();
            const eurRate = currencies.getEurRate();

            setCurrencyDate(usdRate.date as string);

            rates = { pln: 1, usd: Number(usdRate.rate), eur: Number(eurRate.rate) };

            setRates(rates);

            const pln = defaults.defaultHourRate;

            const currenciesObj = recalculateCurrencies({ pln }, rates);

            const { usd, eur } = currenciesObj;

            // setHourRateUsd(usd);
            // setHourRateEur(eur);

            recalculateByHourRate(currenciesObj);
            recalculateByYearlyIncome(currenciesObj);
            recalculateByMonthlyIncome(currenciesObj);
        })();
        }, []);

    useEffect(() => {
        setDaysInYear(getYearDaysCount(year));
        setWorkingDays(getWorkingDays(year));
        setFreeDays(getFreeDaysCount(year));

        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByYearlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByMonthlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
    }, [year]);

    useEffect(() => {
        setAvgDayPerMonth(shortendNumber(workingDays / 12));
    }, [workingDays]);

    useEffect(() => {
        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByYearlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByMonthlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
    }, [hourPerDay]);

    useEffect(()=> {
        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByYearlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByMonthlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
    }, [payedLeaveDays])

    const onSubmit = async () => {
        setError("");

        console.log('calculate');
    };

    const recalculateByHourRate = (({ pln, usd, eur }: CurrenciesList) => {
        // setHourRatePln(pln);
        // setHourRateUsd(usd);
        // setHourRateEur(eur);

        setHourlyRates({ pln, usd, eur });
    });

    const recalculateByHourlyRatePln = (value:number) => {
        const recalculated = recalculateCurrencies({ pln: Number(value) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByYearlyIncome(recalculated);
        recalculateByMonthlyIncome(recalculated);
    }

    const recalculateByHourlyRateUsd = (value:number) => {
        const recalculated = recalculateCurrencies({ usd: Number(value) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByYearlyIncome(recalculated);
        recalculateByMonthlyIncome(recalculated);
    }

    const recalculateByHourlyRateEur = (value:number) => {
        const recalculated = recalculateCurrencies({ eur: Number(value) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByYearlyIncome(recalculated);
        recalculateByMonthlyIncome(recalculated);
    }



    const monthlyMultiplier = hourPerDay * (workingDays - payedLeaveDays) / 12;
    const recalculateByMonthlyIncome = ({pln: currentPln, usd: currentUsd, eur: currentEru}: CurrenciesList) => {

        // setMonthlyIncomePln(shortendNumber(currentPln * monthlyMultiplier));
        // setMonthlyIncomeUsd(shortendNumber(currentUsd * monthlyMultiplier));
        // setMonthlyIncomeEur(shortendNumber(currentEru * monthlyMultiplier));

        const pln = shortendNumber(currentPln * monthlyMultiplier);
        const usd = shortendNumber(currentUsd * monthlyMultiplier);
        const eur = shortendNumber(currentEru * monthlyMultiplier);

        setMonthlyIncomes({ pln, usd, eur });
    }

    const recalculateByMonthlyIncomePln = (monthlyPln:number) => {
        // const recalculated = recalculateCurrencies({ pln: shortendNumber(monthlyPln / hourPerDay / ((workingDays - payedLeaveDays) / 12)) }, rates);
        const recalculated = recalculateCurrencies({ pln: shortendNumber(monthlyPln / monthlyMultiplier) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByMonthlyIncome(recalculated);
        recalculateByYearlyIncome(recalculated);

        // setMonthlyIncomePln(monthlyPln);
        setMonthlyIncomes({...monthlyIncomes, monthlyPln});

    }

    const recalculateByMonthlyIncomeUsd = (monthlyUsd:number) => {
        const recalculated = recalculateCurrencies({ usd: shortendNumber(monthlyUsd / monthlyMultiplier) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByMonthlyIncome(recalculated);
        recalculateByYearlyIncome(recalculated);

        // setMonthlyIncomeUsd(monthlyUsd);
        setMonthlyIncomes({...monthlyIncomes, monthlyUsd});
    }

    const recalculateByMonthlyIncomeEur = (monthlyEur:number) => {
        const recalculated = recalculateCurrencies({ eur: shortendNumber(monthlyEur / monthlyMultiplier) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByMonthlyIncome(recalculated);
        recalculateByYearlyIncome(recalculated);

        // setMonthlyIncomeEur(monthlyEur);
        setMonthlyIncomes({...monthlyIncomes, monthlyEur});
    }



    const yearlyMultiplier = hourPerDay * (workingDays - payedLeaveDays);
    const recalculateByYearlyIncome = ({pln: currentPln, usd: currentUsd, eur: currentEur}: CurrenciesList) => {
        const pln = shortendNumber(currentPln * yearlyMultiplier, 0);
        const usd = shortendNumber(currentUsd * yearlyMultiplier, 0);
        const eur = shortendNumber(currentEur * yearlyMultiplier, 0);

        setYearlyIncomes({ pln, usd, eur });
    }

    const recalculateByYearlyIncomePln = (yearlyPln:number) => {
        console.log(yearlyPln);

        if (!yearlyPln) {
            setYearlyIncomes({ pln: null, usd: null, eur: null });
        } else {
            const recalculated = recalculateCurrencies({pln: shortendNumber(yearlyPln / yearlyMultiplier)}, rates);

            recalculateByHourRate(recalculated);
            recalculateByMonthlyIncome(recalculated);
            recalculateByYearlyIncome(recalculated);

            const abc = yearlyIncomes;

            setYearlyIncomes({...abc, pln: yearlyPln});
        }
    }

    const recalculateByYearlyIncomeUsd = (yearlyUsd:number) => {
        const recalculated = recalculateCurrencies({ usd: shortendNumber(yearlyUsd / yearlyMultiplier) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByMonthlyIncome(recalculated);
        recalculateByYearlyIncome(recalculated);

        // setYearlyIncomeUsd(yearlyUsd);
        setYearlyIncomes({...yearlyIncomes, yearlyUsd})
    }

    const recalculateByYearlyIncomeEur = (yearlyEur:number) => {
        const recalculated = recalculateCurrencies({ eur: shortendNumber(yearlyEur / yearlyMultiplier) }, rates);

        recalculateByHourRate(recalculated);
        recalculateByMonthlyIncome(recalculated);
        recalculateByYearlyIncome(recalculated);

        // setYearlyIncomeEur(yearlyEur);
        setYearlyIncomes({...yearlyIncomes, yearlyEur})
    }

    return (
        <div className="container px-8 mx-auto mt-16 lg:mt-32 text-white">
            {error ? <ErrorMessage message={error} /> : null}
            <form
                className="max-w-3xl mx-auto"
                onSubmit={(e) => {
                    onSubmit();
                }}
                >

                {/*<Title>Currency Calculator</Title>*/}

                <Row title="Settings" description={workingDays ? `There is ${workingDays} working days in ${year}, avg ${avgDayPerMonth} days per month` : ''}>
                    <Input
                        label="Year"
                        name="year"
                        value={year}
                        onChange={setYear}
                    />

                    <Input
                        label="Hour Per Day"
                        name="hourPerDay"
                        value={hourPerDay}
                        onChange={setHourPerDay}
                    />

                    <Input
                        label="Payed leave days"
                        name="payedLeaveDays"
                        value={payedLeaveDays}
                        onChange={setPayedLeaveDays}
                        disabled
                    />
                </Row>

                <Row title="Currencies" description={currencyDate ? `currencies from NBP (${currencyDate})` : ''}>
                    <Input
                        className="text-zink-400"
                        label="PLN"
                        name="pln"
                        value={rates.pln}
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        label="USD"
                        name="usd"
                        value={rates.usd}
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        label="EUR"
                        name="eur"
                        value={rates.eur}
                        disabled
                    />
                </Row>


                <Row title="Hour rate">
                    <Input
                        label="Hour rate PLN"
                        name="hourRatePln"
                        value={hourlyRates.pln}
                        onChange={recalculateByHourlyRatePln}
                    />

                    <Input
                        label="Hour rate USD"
                        name="hourRateUsd"
                        value={hourlyRates.usd}
                        onChange={recalculateByHourlyRateUsd}
                        disabled={!rates.usd}
                    />

                    <Input
                        label="Hour rate EUR"
                        name="hourRateEur"
                        value={hourlyRates.eur}
                        onChange={recalculateByHourlyRateEur}
                        disabled={!rates.eur}
                    />
                </Row>

                <Row title="Monthly income">
                    <Input
                        label="Monthly income PLN"
                        name="monthlyIncomePln"
                        value={monthlyIncomes.pln}
                        onChange={recalculateByMonthlyIncomePln}
                    />

                    <Input
                        label="Monthly income USD"
                        name="monthlyIncomeUsd"
                        value={monthlyIncomes.usd}
                        onChange={recalculateByMonthlyIncomeUsd}
                        disabled={!rates.usd}
                    />

                    <Input
                        label="Monthly income EUR"
                        name="monthlyIncomeEur"
                        value={monthlyIncomes.eur}
                        onChange={recalculateByMonthlyIncomeEur}
                        disabled={!rates.eur}
                    />
                </Row>

                <Row title="Yearly income">
                    <Input
                        label="Yearly income PLN"
                        name="yearlyIncomePln"
                        value={yearlyIncomes.pln}
                        onChange={recalculateByYearlyIncomePln}
                    />

                    <Input
                        label="Yearly income USD"
                        name="yearlyIncomeUsd"
                        value={yearlyIncomes.usd}
                        onChange={recalculateByYearlyIncomeUsd}
                        disabled={!rates.usd}
                    />

                    <Input
                        label="Yearly income EUR"
                        name="yearlyIncomeEur"
                        value={yearlyIncomes.eur}
                        onChange={recalculateByYearlyIncomeEur}
                        disabled={!rates.eur}
                    />
                </Row>


{/*                <p>Year: {year}</p>*/}
{/*                <p>Days in year: {daysInYear}</p>*/}
{/*                <p>Working days: {workingDays}</p>*/}
{/*                <p>Free days: {freeDays}</p>*/}
{/*                <p>Avg working days per month: {avgDayPerMonth}</p>*/}
{/*                <p>Avg hours per month: {avgDayPerMonth * hourPerDay}</p>*/}
{/*<br/>*/}
{/*                {currencyDate && <p>Currency Date: {currencyDate}</p>}*/}
{/*                {usdRate && <p>Usd rate: {usdRate}</p>}*/}
{/*                {euroRate && <p>Euro rate: {euroRate}</p>}*/}
{/*<br/>*/}
{/*                {hourRatePln && <p>Hour rate PLN: {hourRatePln}</p>}*/}
{/*                {hourRateUsd && <p>Hour rate USD: {hourRateUsd}</p>}*/}
{/*                {hourRateEur && <p>Hour rate EUR: {hourRateEur}</p>}*/}
{/*<br/>*/}
{/*                {hourRatePln && <p>Monthly rate PLN: {monthlyIncomePln}</p>}*/}
{/*                {hourRatePln && <p>Yearly rate PLN: {yearlyIncomePln}</p>}*/}
{/*                <br/>*/}
{/*                {hourRateUsd && <p>Monthly rate USD: {monthlyIncomeUsd}</p>}*/}
{/*                {hourRateUsd && <p>Yearly rate USD: {yearlyIncomeUsd}</p>}*/}
{/*                <br/>*/}
{/*                {hourRateEur && <p>Monthly rate EUR: {monthlyIncomeEur}</p>}*/}
{/*                {hourRateEur && <p>Yearly rate EUR: {yearlyIncomeEur}</p>}*/}
            </form>
        </div>
    );
};
