"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../components/error";
import {Title} from "../components/title";
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

    const [error, setError] = useState("");

    const [currencyDate, setCurrencyDate] = useState();
    const [plnRate, setPlnRate] = useState(1);
    const [usdRate, setUsdRate] = useState();
    const [euroRate, setEuroRate] = useState();

    const [hourPerDay, setHourPerDay] = useState(defaults.defaultHourPerDay);

    const [nettoBruttoRate, setNettoBruttoRate] = useState(defaults.nonVatRate);

    const [year, setYear] = useState(currentYear);
    const [daysInYear, setDaysInYear] = useState(defaults.daysInYear);
    const [workingDays, setWorkingDays] = useState(defaults.workingDays);
    const [freeDays, setFreeDays] = useState(defaults.freeDays);
    const [payedLeaveDays, setPayedLeaveDays] = useState(defaults.defaultPayedLeaveDays);

    const [avgDayPerMonth, setAvgDayPerMonth] = useState(defaults.defaltAvgDayPerMonth);

    const [hourRatePln, setHourRatePln] = useState(defaults.defaultHourRate);
    const [hourRateUsd, setHourRateUsd] = useState();
    const [hourRateEur, setHourRateEur] = useState();

    const [yearlyIncomePln, setYearlyIncomePln] = useState();
    const [yearlyIncomeUsd, setYearlyIncomeUsd] = useState();
    const [yearlyIncomeEur, setYearlyIncomeEur] = useState();

    const [monthlyIncomePln, setMonthlyIncomePln] = useState();
    const [monthlyIncomeUsd, setMonthlyIncomeUsd] = useState();
    const [monthlyIncomeEur, setMonthlyIncomeEur] = useState();

    function recalculateCurrenciesByPln(pln, rates) {
        const usd = (pln / rates.usd).toFixed(defaults.fixedToForSmall);
        const eur = (pln / rates.eur).toFixed(defaults.fixedToForSmall);

        return {pln, usd, eur}
    }

    useEffect( () => {
        (async () => {
            const currencies = await new Currencies();

            const usdRate = currencies.getUsdRate();
            setCurrencyDate(usdRate.date);
            setUsdRate(usdRate.rate);

            const eurRate = currencies.getEurRate();
            setEuroRate(eurRate.rate);

            const rates = {usd: usdRate.rate, eur: usdRate.rate};

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

    const recalculateByHourRate = (({pln, usd, eur}) => {
        setHourRatePln(pln);
        setHourRateUsd(usd);
        setHourRateEur(eur);
    });

    const recalculateByHourlyRatePln = (value) => {
        const pln = value;
        const usd = (value * plnRate / usdRate).toFixed(defaults.fixedToForSmall);
        const eur = (value * plnRate / euroRate).toFixed(defaults.fixedToForSmall);

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateUsd = (value) => {
        const pln = (value * usdRate / plnRate).toFixed(defaults.fixedToForSmall);
        const usd = value;
        const eur = (value * usdRate / euroRate).toFixed(defaults.fixedToForSmall);

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateEur = (value) => {
        const pln = (value * euroRate).toFixed(defaults.fixedToForSmall);
        const usd = (value * euroRate / usdRate).toFixed(defaults.fixedToForSmall);
        const eur = value;

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }



    const recalculateByMonthlyIncome = ({pln, usd, eur}) => {
        pln ? setMonthlyIncomePln((pln * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge)) : null;
        usd ? setMonthlyIncomeUsd((usd * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge)) : null;
        eur ? setMonthlyIncomeEur((eur * hourPerDay * (workingDays - payedLeaveDays) / 12).toFixed(defaults.fixedToForLarge)) : null;
    }

    const recalculateByMonthlyIncomePln = (monthlyPln) => {
        const pln = (monthlyPln / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall);
        const usd = (pln / usdRate).toFixed(defaults.fixedToForSmall);
        const eur = (pln / euroRate).toFixed(defaults.fixedToForSmall);

        setMonthlyIncomePln(monthlyPln);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
    }

    const recalculateByMonthlyIncomeUsd = (monthlyUsd) => {
        const usd = (monthlyUsd / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall);
        const pln = (usd * usdRate).toFixed(defaults.fixedToForSmall);
        const eur = (usd * usdRate / euroRate).toFixed(defaults.fixedToForSmall);

        setMonthlyIncomeUsd(monthlyUsd);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, eur});
        recalculateByYearlyIncome({pln, usd, eur});
    }

    const recalculateByMonthlyIncomeEur = (monthlyEur) => {
        const eur = (monthlyEur / hourPerDay / ((workingDays - payedLeaveDays) / 12)).toFixed(defaults.fixedToForSmall);
        const pln = (eur * euroRate).toFixed(defaults.fixedToForSmall);
        const usd = (eur * usdRate / euroRate).toFixed(defaults.fixedToForSmall);

        setMonthlyIncomeEur(monthlyEur);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd});
        recalculateByYearlyIncome({pln, usd, eur});
    }



    const recalculateByYearlyIncome = ({pln, usd, eur}) => {
        pln ? setYearlyIncomePln((pln * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge)) : null;
        usd ? setYearlyIncomeUsd((usd * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge)) : null;
        eur ? setYearlyIncomeEur((eur * hourPerDay * (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForLarge)) : null;
    }

    const recalculateByYearlyIncomePln = (YearlyPln) => {
        const pln = (YearlyPln / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall);
        const usd = (pln / usdRate).toFixed(defaults.fixedToForSmall);
        const eur = (pln / euroRate).toFixed(defaults.fixedToForSmall);

        setYearlyIncomePln(YearlyPln);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
        recalculateByYearlyIncome({usd, eur});
    }

    const recalculateByYearlyIncomeUsd = (yearlyUsd) => {
        const usd = (yearlyUsd / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall);
        const pln = (usd * usdRate).toFixed(defaults.fixedToForSmall);
        const eur = (usd * usdRate / euroRate).toFixed(defaults.fixedToForSmall);

        setYearlyIncomeUsd(yearlyUsd);
        recalculateByHourRate({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
        recalculateByYearlyIncome({pln, eur});
    }

    const recalculateByYearlyIncomeEur = (yearlyEur) => {
        const eur = (yearlyEur / hourPerDay / (workingDays - payedLeaveDays)).toFixed(defaults.fixedToForSmall);
        const pln = (eur * euroRate).toFixed(defaults.fixedToForSmall);
        const usd = (eur * usdRate / euroRate).toFixed(defaults.fixedToForSmall);

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
