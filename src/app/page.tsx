"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../components/error";
import {getFreeDaysCount, getWorkingDays, getYearDaysCount} from "../utils/holidays";
import {Currencies } from "../utils/currencies";
import {Row} from "../components/row";
import {Input} from "../components/input";

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

    const [currencyDate, setCurrencyDate] = useState('');
    const [plnRate, setPlnRate] = useState(1);
    const [usdRate, setUsdRate] = useState(0);
    const [euroRate, setEuroRate] = useState(0);

    const [hourPerDay, setHourPerDay] = useState(defaults.defaultHourPerDay);

    const [nettoBruttoRate, setNettoBruttoRate] = useState(defaults.nonVatRate);

    const [year, setYear] = useState(currentYear);
    const [daysInYear, setDaysInYear] = useState(defaults.daysInYear);
    const [workingDays, setWorkingDays] = useState(defaults.workingDays);
    const [freeDays, setFreeDays] = useState(defaults.freeDays);
    const [payedLeaveDays, setPayedLeaveDays] = useState(defaults.defaultPayedLeaveDays);

    const [avgDayPerMonth, setAvgDayPerMonth] = useState(defaults.defaltAvgDayPerMonth);

    const [hourRatePln, setHourRatePln] = useState(defaults.defaultHourRate);
    const [hourRateUsd, setHourRateUsd] = useState(0);
    const [hourRateEur, setHourRateEur] = useState(0);

    const [yearlyIncomePln, setYearlyIncomePln] = useState(0);
    const [yearlyIncomeUsd, setYearlyIncomeUsd] = useState(0);
    const [yearlyIncomeEur, setYearlyIncomeEur] = useState(0);

    const [monthlyIncomePln, setMonthlyIncomePln] = useState(0);
    const [monthlyIncomeUsd, setMonthlyIncomeUsd] = useState(0);
    const [monthlyIncomeEur, setMonthlyIncomeEur] = useState(0);

    function recalculateCurrenciesByPln(pln: number, rates: {usd: number, eur: number}): {pln:number,usd:number,eur:number} {
        const usd: number = Number((pln / rates.usd).toFixed(defaults.fixedToForSmall));
        const eur: number = Number((pln / rates.eur).toFixed(defaults.fixedToForSmall));

        return {pln, usd, eur}
    }

    useEffect( () => {
        let rates = {usd:0, eur:0};
        (async () => {
            const currencies = await new Currencies();

            const usdRate = currencies.getUsdRate();
            setCurrencyDate(usdRate.date as string);
            setUsdRate(Number(usdRate.rate as number));

            const eurRate = currencies.getEurRate();
            setEuroRate(Number(eurRate.rate as number));

            rates = {usd: Number(usdRate.rate), eur: Number(usdRate.rate)};

            const pln = defaults.defaultHourRate;

            const currenciesObj = recalculateCurrenciesByPln(pln, rates);

            const {usd, eur} = currenciesObj;

            setHourRateUsd(usd);
            setHourRateEur(eur);

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
        setAvgDayPerMonth(Number((workingDays / 12).toFixed(defaults.fixedToForSmall)));
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

    const recalculateByHourRate = (({pln, usd, eur}: {pln: number, usd: number, eur: number}) => {
        setHourRatePln(pln);
        setHourRateUsd(usd);
        setHourRateEur(eur);
    });

    const recalculateByHourlyRatePln = (value:number) => {
        const pln: number = Number(value);
        const usd: number = Number((value * plnRate / usdRate).toFixed(defaults.fixedToForSmall));
        const eur: number = Number((value * plnRate / euroRate).toFixed(defaults.fixedToForSmall));

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateUsd = (value:number) => {
        const pln: number = Number((value * usdRate / plnRate).toFixed(defaults.fixedToForSmall));
        const usd: number = Number(value);
        const eur: number = Number((value * usdRate / euroRate).toFixed(defaults.fixedToForSmall));

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateEur = (value:number) => {
        const pln: number = Number((value * euroRate).toFixed(defaults.fixedToForSmall));
        const usd: number = Number((value * euroRate / usdRate).toFixed(defaults.fixedToForSmall));
        const eur: number = Number(value);

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }



    const recalculateByMonthlyIncome = ({pln, usd, eur}: {pln?: number, usd?: number, eur?: number}) => {
        pln ? setMonthlyIncomePln(Number((pln * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge))) : null;
        usd ? setMonthlyIncomeUsd(Number((usd * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge))) : null;
        eur ? setMonthlyIncomeEur(Number((eur * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge))) : null;
    }

    const recalculateByMonthlyIncomePln = (monthlyPln:number) => {
        const pln:number = Number((monthlyPln / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall));
        const usd:number = Number((pln / usdRate).toFixed(defaults.fixedToForSmall));
        const eur:number = Number((pln / euroRate).toFixed(defaults.fixedToForSmall));

        setMonthlyIncomePln(monthlyPln);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
    }

    const recalculateByMonthlyIncomeUsd = (monthlyUsd:number) => {
        const usd: number = Number((monthlyUsd / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall));
        const pln:number = Number((usd * usdRate).toFixed(defaults.fixedToForSmall));
        const eur:number = Number((usd * usdRate / euroRate).toFixed(defaults.fixedToForSmall));

        setMonthlyIncomeUsd(monthlyUsd);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, eur});
        recalculateByYearlyIncome({pln, usd, eur});
    }

    const recalculateByMonthlyIncomeEur = (monthlyEur:number) => {
        const eur: number = Number((monthlyEur / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall));
        const pln:number = Number((eur * euroRate).toFixed(defaults.fixedToForSmall));
        const usd:number = Number((eur * usdRate / euroRate).toFixed(defaults.fixedToForSmall));

        setMonthlyIncomeEur(monthlyEur);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd});
        recalculateByYearlyIncome({pln, usd, eur});
    }



    const recalculateByYearlyIncome = ({pln, usd, eur}: {pln?: number, usd?: number, eur?: number}) => {
        pln ? setYearlyIncomePln(Number((pln * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge))) : null;
        usd ? setYearlyIncomeUsd(Number((usd * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge))) : null;
        eur ? setYearlyIncomeEur(Number((eur * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge))) : null;
    }

    const recalculateByYearlyIncomePln = (YearlyPln:number) => {
        const pln:number = Number((YearlyPln / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall));
        const usd:number = Number((pln / usdRate).toFixed(defaults.fixedToForSmall));
        const eur:number = Number((pln / euroRate).toFixed(defaults.fixedToForSmall));

        setYearlyIncomePln(YearlyPln);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
        recalculateByYearlyIncome({usd, eur});
    }

    const recalculateByYearlyIncomeUsd = (yearlyUsd:number) => {
        const usd:number = Number((yearlyUsd / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall));
        const pln:number = Number((usd * usdRate).toFixed(defaults.fixedToForSmall));
        const eur:number = Number((usd * usdRate / euroRate).toFixed(defaults.fixedToForSmall));

        setYearlyIncomeUsd(yearlyUsd);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
        recalculateByYearlyIncome({pln, eur});
    }

    const recalculateByYearlyIncomeEur = (yearlyEur:number) => {
        const eur:number = Number((yearlyEur / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall));
        const pln:number = Number((eur * euroRate).toFixed(defaults.fixedToForSmall));
        const usd:number = Number((eur * usdRate / euroRate).toFixed(defaults.fixedToForSmall));

        setYearlyIncomeEur(yearlyEur);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd});
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
                        value={plnRate}
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        label="USD"
                        name="usd"
                        value={usdRate}
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        label="EUR"
                        name="eur"
                        value={euroRate}
                        disabled
                    />
                </Row>


                <Row title="Hour rate">
                    <Input
                        label="Hour rate PLN"
                        name="hourRatePln"
                        value={hourRatePln}
                        onChange={recalculateByHourlyRatePln}
                    />

                    <Input
                        label="Hour rate USD"
                        name="hourRateUsd"
                        value={hourRateUsd}
                        onChange={recalculateByHourlyRateUsd}
                        disabled={!usdRate}
                    />

                    <Input
                        label="Hour rate EUR"
                        name="hourRateEur"
                        value={hourRateEur}
                        onChange={recalculateByHourlyRateEur}
                        disabled={!euroRate}
                    />
                </Row>

                <Row title="Monthly income">
                    <Input
                        label="Monthly income PLN"
                        name="monthlyIncomePln"
                        value={monthlyIncomePln}
                        onChange={recalculateByMonthlyIncomePln}
                    />

                    <Input
                        label="Monthly income USD"
                        name="monthlyIncomeUsd"
                        value={monthlyIncomeUsd}
                        onChange={recalculateByMonthlyIncomeUsd}
                        disabled={!usdRate}
                    />

                    <Input
                        label="Monthly income EUR"
                        name="monthlyIncomeEur"
                        value={monthlyIncomeEur}
                        onChange={recalculateByMonthlyIncomeEur}
                        disabled={!euroRate}
                    />
                </Row>

                <Row title="Yearly income">
                    <Input
                        label="Yearly income PLN"
                        name="yearlyIncomePln"
                        value={yearlyIncomePln}
                        onChange={recalculateByYearlyIncomePln}
                    />

                    <Input
                        label="Yearly income USD"
                        name="yearlyIncomeUsd"
                        value={yearlyIncomeUsd}
                        onChange={recalculateByYearlyIncomeUsd}
                        disabled={!usdRate}
                    />

                    <Input
                        label="Yearly income EUR"
                        name="yearlyIncomeEur"
                        value={yearlyIncomeEur}
                        onChange={recalculateByYearlyIncomeEur}
                        disabled={!euroRate}
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
