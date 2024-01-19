"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../../components/error";
import {Title} from "../../components/title";
import {getFreeDaysCount, getWorkingDays, getYearDaysCount} from "../../utils/holidays";
import {getEuroRate, getUsdRate} from "../../utils/currencies";
import {Row} from "../../components/row";
import {Input} from "../../components/input";

export default function Home() {
    const nonVatRate = 1;
    const vatRate = 1.23;
    const defaultHourRate = 120;
    const fixed = 0;

    const currentYear = new Date().getFullYear();

    const [error, setError] = useState("");

    const [currencyDate, setCurrencyDate] = useState();
    const [usdRate, setUsdRate] = useState();
    const [euroRate, setEuroRate] = useState();

    const [hourPerDay, setHourPerDay] = useState(8);

    const [nettoBruttoRate, setNettoBruttoRate] = useState(nonVatRate);

    const [year, setYear] = useState(currentYear);
    const [daysInYear, setDaysInYear] = useState(getYearDaysCount(currentYear));
    const [workingDays, setWorkingDays] = useState(getWorkingDays(currentYear));
    const [freeDays, setFreeDays] = useState(getFreeDaysCount(currentYear));

    const [avgDayPerMonth, setAvgDayPerMonth] = useState(22);

    const [hourRatePln, setHourRatePln] = useState(defaultHourRate);
    const [hourRateUsd, setHourRateUsd] = useState();
    const [hourRateEur, setHourRateEur] = useState();

    const [yearlyIncomePln, setYearlyIncomePln] = useState();
    const [yearlyIncomeUsd, setYearlyIncomeUsd] = useState();
    const [yearlyIncomeEur, setYearlyIncomeEur] = useState();

    const [monthlyIncomePln, setMonthlyIncomePln] = useState();
    const [monthlyIncomeUsd, setMonthlyIncomeUsd] = useState();
    const [monthlyIncomeEur, setMonthlyIncomeEur] = useState();

    useEffect( () => {
        (async () => {
            const usdRate = await getUsdRate();
            setCurrencyDate(usdRate.date);
            setUsdRate(usdRate.rate);

            const pln = defaultHourRate;
            const usd = Number((pln / usdRate.rate).toFixed(2));

            setHourRateUsd(usd);

            recalculateByHourRate({pln, usd});
        })();

        (async() => {
            const euroRate = await getEuroRate();
            setEuroRate(euroRate.rate);

            const pln = defaultHourRate;
            const eur = Number((pln / euroRate.rate).toFixed(2));
            setHourRateEur(eur);

            recalculateByHourRate({pln, eur});
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
        setAvgDayPerMonth(Number((workingDays / 12).toFixed(2)));
    }, [workingDays]);

    useEffect(() => {
        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByYearlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        recalculateByMonthlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
    }, [hourPerDay]);


    const onSubmit = async () => {
        setError("");

        console.log('calculate');
    };

    const recalculateByYearlyIncome = ({pln, usd, eur}) => {
        setYearlyIncomePln(Number(pln * hourPerDay * workingDays).toFixed(fixed));

        if (usd) {
            setYearlyIncomeUsd(Number(usd * hourPerDay * workingDays).toFixed(fixed));
        }

        if (eur) {
            setYearlyIncomeEur(Number(eur * hourPerDay * workingDays).toFixed(fixed));
        }
    }

    const recalculateByMonthlyIncome = ({pln, usd, eur}) => {
        setMonthlyIncomePln(Number(pln * hourPerDay * workingDays / 12).toFixed(fixed));

        if (usd) {
            setMonthlyIncomeUsd(Number(usd * hourPerDay * workingDays / 12).toFixed(fixed));
        }

        if (eur) {
            setMonthlyIncomeEur(Number(eur * hourPerDay * workingDays / 12).toFixed(fixed));
        }
    }

    const recalculateByHourRate = (({pln, usd, eur}) => {
        if (pln) {
            setHourRatePln(pln);
        }

        if (usd) {
            setHourRateUsd(usd);
        }

        if (eur) {
            setHourRateEur(eur);
        }

        // recalculateByYearlyIncome({pln, usd, eur});

        // recalculateByMonthlyIncome({pln, usd, eur});
    })

    const recalculateByHourlyRatePln = (pln) => {
        const usd = Number((pln / usdRate).toFixed(2));
        const eur = Number((pln / euroRate).toFixed(2))

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateUsd = (usd) => {
        const pln = Number((usd * usdRate).toFixed(2));
        const eur = Number((usd * usdRate / euroRate).toFixed(2));

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByHourlyRateEur = (eur) => {
        const pln = Number((eur * euroRate).toFixed(2));
        const usd = Number((eur * euroRate / usdRate).toFixed(2));

        recalculateByHourRate({pln, usd, eur});
        recalculateByYearlyIncome({pln, usd, eur});
        recalculateByMonthlyIncome({pln, usd, eur});
    }

    const recalculateByMonthlyIncomePln = (monthlyPln) => {
        // setMonthlyIncomePln(Number(pln * hourPerDay * workingDays / 12).toFixed(fixed));
        const pln = (monthlyPln / hourPerDay / (workingDays * 12)).toFixed(2);
        const usd = pln * usdRate;
        const eur = pln * euroRate;

        recalculateByHourRate({pln, usd, eur});
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

                <Title>Currency Calculator</Title>

                <Row>
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
                    />

                    <Input
                        label="Hour rate EUR"
                        name="hourRateEur"
                        value={hourRateEur}
                        onChange={recalculateByHourlyRateEur}
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
                        // onChange={recalculateByHourlyRateUsd}
                    />

                    <Input
                        label="Monthly income EUR"
                        name="monthlyIncomeEur"
                        value={monthlyIncomeEur}
                        // onChange={recalculateByHourlyRateEur}
                    />
                </Row>

                <Row title="Yearly income">
                    <Input
                        label="Yearly income PLN"
                        name="yearlyIncomePln"
                        value={yearlyIncomePln}
                        // onChange={recalculateByHourlyRatePln}
                    />

                    <Input
                        label="Yearly income USD"
                        name="yearlyIncomeUsd"
                        value={yearlyIncomeUsd}
                        // onChange={recalculateByHourlyRateUsd}
                    />

                    <Input
                        label="Yearly income EUR"
                        name="yearlyIncomeEur"
                        value={yearlyIncomeEur}
                        // onChange={recalculateByHourlyRateEur}
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
