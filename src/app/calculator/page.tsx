"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../../components/error";
import {getFreeDaysCount, getWorkingDays, getYearDaysCount} from "../../utils/holidays";
import {Currencies, CurrenciesList, recalculateByMultiplier, recalculateCurrencies} from "../../utils/currencies";
import {Row} from "../../components/row";
import {Input} from "../../components/input";
import {shortendNumber, shortendNumbers} from "../../utils/utils";

export default function Calculator() {
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
        defaultPayedLeaveDays: 26,

        fixedToForLarge: 0,
        fixedToForSmall: 2,
    }

    const [error, setError] = useState('');

    const [currencyDate, setCurrencyDate]: [string, Function] = useState('');
    const [rates, setRates]: [CurrenciesList, Function] = useState({ pln: 1, usd: 0, eur: 0 });

    const [hourPerDay, setHourPerDay]: [number, Function] = useState(defaults.defaultHourPerDay);

    // const [nettoBruttoRate, setNettoBruttoRate]: [number, Function] = useState(defaults.nonVatRate);

    const [year, setYear]: [number, Function] = useState(currentYear);
    const [daysInYear, setDaysInYear]: [number, Function] = useState(defaults.daysInYear);
    const [workingDays, setWorkingDays]: [number, Function] = useState(defaults.workingDays);
    const [freeDays, setFreeDays]: [number, Function] = useState(defaults.freeDays);
    const [payedLeaveDays, setPayedLeaveDays]: [number, Function] = useState(defaults.defaultPayedLeaveDays);
    const [switchPayedleaveDays, setSwitchPayedleaveDays]: [boolean, Function] = useState(false);

    const [monthlyMultiplier, setMonthlyMultiplier] = useState(1);
    const [yearlyMultiplier, setYearlyMultiplier] = useState(1);
    const [payedLeaveDaysMultiplier, setPayedLeaveDaysMultiplier] = useState(1);
    const [vatMultiplier, setVatMultiplier] = useState(defaults.nonVatRate);

    const [avgDayPerMonth, setAvgDayPerMonth]: [number, Function] = useState(defaults.defaltAvgDayPerMonth);

    const [hourlyRates, setHourlyRates]: [CurrenciesList, Function] = useState({ pln: defaults.defaultHourRate, usd: 0, eur: 0 });
    const [dailyRates, setDailyRates]: [CurrenciesList, Function] = useState({ pln: defaults.defaultHourRate * defaults.defaultHourPerDay, usd: 0, eur: 0 });
    const [monthlyIncomes, setMonthlyIncomes]: [CurrenciesList, Function] = useState({ pln: 0, usd: 0, eur: 0 });
    const [yearlyIncomes, setYearlyIncomes]: [CurrenciesList, Function] = useState({ pln: 0, usd: 0, eur: 0 });

    useEffect( () => {
        const monthlyMultiplier = hourPerDay * workingDays / 12;
        const yearlyMultiplier = hourPerDay * workingDays;

        setMonthlyMultiplier(monthlyMultiplier);
        setYearlyMultiplier(yearlyMultiplier);

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

            setRecalculateHourlyRate(currenciesObj);
            // setRecalculateHourlyRate(currenciesObj, vatMultiplier);
            setRecalculateDailyRate(currenciesObj, hourPerDay);
            // setRecalculateDailyRate(currenciesObj, hourPerDay * vatMultiplier);
            setRecalculateYearlyIncomes(currenciesObj, yearlyMultiplier);
            // setRecalculateYearlyIncomes(currenciesObj, yearlyMultiplier * vatMultiplier);
            setRecalculateMonthlyIncomes(currenciesObj, monthlyMultiplier);
            // setRecalculateMonthlyIncomes(currenciesObj, monthlyMultiplier * vatMultiplier);
        })();
    }, []);

    useEffect(() => {
        setDaysInYear(getYearDaysCount(year));
        setWorkingDays(getWorkingDays(year));
        setFreeDays(getFreeDaysCount(year));

        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        // recalculateByYearlyIncome({pln: rates.pln, usd: rates.usd, eur: rates.eur});
        // recalculateByMonthlyIncome({pln: rates.pln, usd: rates.usd, eur: rates.eur});
    }, [year]);

    useEffect(() => {
        setAvgDayPerMonth(shortendNumber(workingDays / 12));
    }, [workingDays]);

    useEffect(() => {
        const monthlyMultiplier = hourPerDay * workingDays / 12;
        const yearlyMultiplier = hourPerDay * workingDays;

        setMonthlyMultiplier(monthlyMultiplier);
        setYearlyMultiplier(yearlyMultiplier);

        const recalculated = recalculateCurrencies({ pln: hourlyRates.pln }, rates);

        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});

        /// ???
        setRecalculateDailyRate(recalculated);
        setRecalculateYearlyIncomes(recalculated, yearlyMultiplier);
        setRecalculateMonthlyIncomes(recalculated, monthlyMultiplier);
    }, [hourPerDay]);

    useEffect(()=> {
        // recalculateByHourRate({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        // recalculateByYearlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
        // recalculateByMonthlyIncome({pln: hourRatePln, usd: hourRateUsd, eur: hourRateEur});
    }, [payedLeaveDays]);

    useEffect(() => {

    }, [switchPayedleaveDays]);

    useEffect(() =>{
        const recalculated = recalculateCurrencies({ pln: Number(hourlyRates.pln) }, rates);

        setRecalculateHourlyRate(recalculated, vatMultiplier);
        setRecalculateDailyRate(recalculated, hourPerDay * vatMultiplier);
        setRecalculateMonthlyIncomes(recalculated, monthlyMultiplier * vatMultiplier);
        setRecalculateYearlyIncomes(recalculated, yearlyMultiplier * vatMultiplier);

    }, [vatMultiplier]);

    const onSubmit = async () => {
        setError("");

        console.log('calculate');
    };

    const setRecalculateHourlyRate = (({ pln, usd, eur }: CurrenciesList, multiplier: number = 1) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForSmall
        );

        setHourlyRates(result);
    });

    const recalculateByHourlyRate = ({data}) => {
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];

        const recalculated = recalculateCurrencies({ [key]: Number(value) }, rates);

        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);
        setRecalculateMonthlyIncomes(recalculated);
        setRecalculateYearlyIncomes(recalculated);
    }

    const setRecalculateDailyRate = (({ pln, usd, eur }: CurrenciesList, multiplier = hourPerDay) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setDailyRates(result);

        return result;
    });

    const recalculateByDailyRate = ({data}) => {
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];

        const recalculated = recalculateCurrencies({ [key]: Number(value) / hourPerDay }, rates);

        setRecalculateHourlyRate(recalculated);
        const dailyRateRecalculated = setRecalculateDailyRate(recalculated);
        setRecalculateMonthlyIncomes(recalculated);
        setRecalculateYearlyIncomes(recalculated);

        setDailyRates({...dailyRateRecalculated, [key]: value});
    }

    const setRecalculateMonthlyIncomes = ({pln, usd, eur}: CurrenciesList, multiplier = monthlyMultiplier) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setMonthlyIncomes(result);

        return result;
    }

    const recalculateByMonthlyIncome = ({data}) => {
        const key = Object.keys(data)[0];
        const value = Number(Object.values(data)[0]);

        const recalculated = recalculateCurrencies({ [key]: shortendNumber(value / monthlyMultiplier) }, rates);

        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);
        const monthlyIcomeRecalculated = setRecalculateMonthlyIncomes(recalculateCurrencies({ [key]: shortendNumber(value) }, rates), 1);
        setRecalculateYearlyIncomes(recalculateCurrencies({ [key]: shortendNumber(value * 12) }, rates), 1);

        setMonthlyIncomes({...monthlyIcomeRecalculated, [key]: value});
    }

    const setRecalculateYearlyIncomes = ({pln, usd, eur}: CurrenciesList, multiplier = yearlyMultiplier) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setYearlyIncomes(result);

        return result;
    }

    const recalculateByYearlyIncome = ({data}) => {
        const key = Object.keys(data)[0];
        const value = Number(Object.values(data)[0]);

        const recalculated = recalculateCurrencies({ [key]: shortendNumber(value / yearlyMultiplier) }, rates);

        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);

        setRecalculateMonthlyIncomes(recalculateCurrencies({ [key]: shortendNumber(value / 12) }, rates), 1);
        const yearlyIncomeRecalculated = setRecalculateYearlyIncomes(recalculateCurrencies({ [key]: shortendNumber(value) }, rates), 1);

        setYearlyIncomes({...yearlyIncomeRecalculated, [key]: value});
    }

    const changePayedLeaveDays = (item) => {
        // todo fixme handle disabled
        setPayedLeaveDays(item.value);
        setSwitchPayedleaveDays(item.disabled);
    };

    const changeVatRate = (item) => {
        console.log(item);

        item.disabled ? setVatMultiplier(item.value) : setVatMultiplier(1/item.value);
    };

    const changeOtherAmortization = (item) => {
        // todo fixme handle disabled

        // setVatRate(item.value);
    };

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
                        label="Country"
                        name="country"
                        value={'PL'}
                        type='select'
                        onChange={() => {}}
                        disabled
                    />

                    <Input
                        label="Year"
                        name="year"
                        value={year}
                        onChange={(year) => setYear(year.value)}
                    />

                    <Input
                        label="Hour Per Day"
                        name="hourPerDay"
                        value={hourPerDay}
                        onChange={(hour) => setHourPerDay(hour.value)}
                    />

                </Row>

                <Row>
                    <Input
                        label="Payed leave days"
                        name="payedLeaveDays"
                        value={payedLeaveDays}
                        onChange={changePayedLeaveDays}
                        type='checkbox-value'
                        disabled
                    />
                    <Input
                        label="Netto/Brutto rate"
                        name="payedLeaveDays"
                        value={defaults.vatRate}
                        onChange={changeVatRate}
                        type='checkbox-value'
                        disabled
                    />
                    <Input
                        label="other amortization"
                        name="payedLeaveDays"
                        value={0}
                        onChange={changeOtherAmortization}
                        type='checkbox-value'
                        disabled
                    />
                </Row>

                <Row title="Currencies" description={currencyDate ? `currencies from NBP (${currencyDate})` : ''}>
                    <Input
                        className="text-zink-400"
                        name="pln"
                        value={rates.pln}
                        currency="pln"
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        name="usd"
                        value={rates.usd}
                        currency="usd"
                        disabled
                    />

                    <Input
                        className="text-zink-400"
                        name="eur"
                        value={rates.eur}
                        currency="eur"
                        disabled
                    />
                </Row>

                <Row title="Hour rate">
                    <Input
                        name="hourRatePln"
                        value={hourlyRates.pln}
                        currency="pln"
                        onChange={recalculateByHourlyRate}
                    />

                    <Input
                        name="hourRateUsd"
                        value={hourlyRates.usd}
                        currency="usd"
                        onChange={recalculateByHourlyRate}
                        disabled={!rates.usd}
                    />

                    <Input
                        name="hourRateEur"
                        value={hourlyRates.eur}
                        currency="eur"
                        onChange={recalculateByHourlyRate}
                        disabled={!rates.eur}
                    />
                </Row>

                <Row title="Daily rate">
                    <Input
                        name="dailyRatePln"
                        value={dailyRates.pln}
                        currency="pln"
                        onChange={recalculateByDailyRate}
                    />

                    <Input
                        name="dailyRateUsd"
                        value={dailyRates.usd}
                        currency="usd"
                        onChange={recalculateByDailyRate}
                        disabled={!rates.usd}
                    />

                    <Input
                        name="hourRateEur"
                        value={dailyRates.eur}
                        currency="eur"
                        onChange={recalculateByDailyRate}
                        disabled={!rates.eur}
                    />
                </Row>

                <Row title="Monthly income">
                    <Input
                        name="monthlyIncomePln"
                        value={monthlyIncomes.pln}
                        currency="pln"
                        onChange={recalculateByMonthlyIncome}
                    />

                    <Input
                        name="monthlyIncomeUsd"
                        value={monthlyIncomes.usd}
                        currency="usd"
                        onChange={recalculateByMonthlyIncome}
                        disabled={!rates.usd}
                    />

                    <Input
                        name="monthlyIncomeEur"
                        value={monthlyIncomes.eur}
                        currency="eur"
                        onChange={recalculateByMonthlyIncome}
                        disabled={!rates.eur}
                    />
                </Row>

                <Row title="Yearly income">
                    <Input
                        name="yearlyIncomePln"
                        value={yearlyIncomes.pln}
                        currency="pln"
                        onChange={recalculateByYearlyIncome}
                    />

                    <Input
                        name="yearlyIncomeUsd"
                        value={yearlyIncomes.usd}
                        currency="usd"
                        onChange={recalculateByYearlyIncome}
                        disabled={!rates.usd}
                    />

                    <Input
                        name="yearlyIncomeEur"
                        value={yearlyIncomes.eur}
                        currency="eur"
                        onChange={recalculateByYearlyIncome}
                        disabled={!rates.eur}
                    />
                </Row>
            </form>
        </div>
    );
};
