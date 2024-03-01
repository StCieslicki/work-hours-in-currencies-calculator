"use client";
import {useEffect, useState} from "react";
import {ErrorMessage} from "../components/error";
import {getFreeDaysCount, getWorkingDays, getYearDaysCount} from "../utils/holidays";
import {Currencies, CurrenciesList, recalculateByMultiplier, recalculateCurrencies} from "../utils/currencies";
import {Row} from "../components/row";
import {Input} from "../components/input";
import {createYearList, shortendNumber, shortendNumbers} from "../utils/utils";
import {RowItems} from "../components/rows/rowItems";

export default function Calculator() {
    const currentYear = new Date().getFullYear();

    const defaults = {
        nonVatRate: 1,
        vatRate: 1.23,
        defaultHourRate: 120,
        defaultHourPerDay: 8,

        defaltAvgDayPerMonth: 22,
        daysInYear: 365,
        workingDays: 252,
        freeDays: 113,
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
        defaults.daysInYear = getYearDaysCount(currentYear);
        defaults.workingDays = getWorkingDays(currentYear);
        defaults.freeDays = getFreeDaysCount(currentYear);

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
    };

    const setRecalculateHourlyRate = (({ pln, usd, eur }: CurrenciesList, multiplier: number = 1) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForSmall
        );

        setHourlyRates(result);
    });

    const setRecalculateDailyRate = (({ pln, usd, eur }: CurrenciesList, multiplier = hourPerDay) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setDailyRates(result);

        return result;
    });

    const setRecalculateMonthlyIncomes = ({pln, usd, eur}: CurrenciesList, multiplier = monthlyMultiplier) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setMonthlyIncomes(result);

        return result;
    }

    const setRecalculateYearlyIncomes = ({pln, usd, eur}: CurrenciesList, multiplier = yearlyMultiplier) => {
        const result = shortendNumbers(
            recalculateByMultiplier({pln, usd, eur}, multiplier), defaults.fixedToForLarge
        );

        setYearlyIncomes(result);

        return result;
    }

    const updateHourly = ({recalculated}: {recalculated: CurrenciesList, key?: string, value?: number}) => {
        console.log('recalculated', recalculated);

        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);
        setRecalculateMonthlyIncomes(recalculated);
        setRecalculateYearlyIncomes(recalculated);
    }

    const updateDaily = ({recalculated, key, value}: {recalculated: CurrenciesList, key?: string, value?: number}) => {
        setRecalculateHourlyRate(recalculated);
        const dailyRateRecalculated = setRecalculateDailyRate(recalculated);
        setRecalculateMonthlyIncomes(recalculated);
        setRecalculateYearlyIncomes(recalculated);

        setDailyRates({...dailyRateRecalculated, [key as string]: value as number});
    }

    const udpateMonthly = ({recalculated, key, value}: {recalculated: CurrenciesList, key?: string, value?: number}) => {
        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);
        const monthlyIcomeRecalculated = setRecalculateMonthlyIncomes(recalculateCurrencies({ [key as string]: shortendNumber(value as number) }, rates), 1);
        setRecalculateYearlyIncomes(recalculateCurrencies({ [key as string]: shortendNumber((value as number) * 12) }, rates), 1);

        setMonthlyIncomes({...monthlyIcomeRecalculated, [key as string]: value});
    }

    const updateYearly = ({recalculated, key, value}: {recalculated: CurrenciesList, key?: string, value?: number}) => {
        setRecalculateHourlyRate(recalculated);
        setRecalculateDailyRate(recalculated);

        setRecalculateMonthlyIncomes(recalculateCurrencies({ [key as string]: shortendNumber((value as number) / 12) }, rates), 1);
        const yearlyIncomeRecalculated = setRecalculateYearlyIncomes(recalculateCurrencies({ [key as string]: shortendNumber(value as number) }, rates), 1);

        setYearlyIncomes({...yearlyIncomeRecalculated, [key as string]: value});
    }

    // @ts-ignore
    const changePayedLeaveDays = (item) => {
        // todo fixme handle disabled
        setPayedLeaveDays(item.value);
        setSwitchPayedleaveDays(item.disabled);
    };

    // @ts-ignore
    const changeVatRate = (item) => {
        item.disabled ? setVatMultiplier(item.value) : setVatMultiplier(1/item.value);
    };

    // @ts-ignore
    const changeOtherAmortization = (item) => {
        // todo fixme handle disabled

        // setVatRate(item.value);
    };

    const changeYear = (year: number) => {
        setYear(Number(year));
    };

    return (
        <div className="container px-8 mx-auto mt-8 lg:mt-16 text-white">
            {error ? <ErrorMessage message={error} /> : null}
            <form
                className="max-w-3xl mx-auto"
                onSubmit={(e) => {
                    onSubmit();
                }}
                >

                <Row title="Settings" description={workingDays ? `There is ${workingDays} working days in ${year}, avg ${avgDayPerMonth} days per month` : ''}>
                    <Input
                        label="Country"
                        name="country"
                        value={'PL'}
                        type='dummy'
                        onChange={() => {}}
                        disabled
                    />

                    <Input
                        label="Year"
                        name="year"
                        value={{list: createYearList(currentYear), current: year}}
                        onChange={changeYear}
                        type='select'
                    />

                    <Input
                        label="Hour Per Day"
                        name="hourPerDay"
                        value={hourPerDay}
                        onChange={(hour: { value: number }) => setHourPerDay(hour.value)}
                    />

                </Row>

                {false && <Row>
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
                }

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

                <RowItems title="Hour rate" value={hourlyRates} rates={rates} updateFn={updateHourly}/>

                <RowItems title="Daily rate" value={dailyRates} rates={rates} updateFn={updateDaily} multiplier={hourPerDay}/>

                <RowItems title="Monthly income" value={monthlyIncomes} rates={rates} updateFn={udpateMonthly} multiplier={monthlyMultiplier}/>

                <RowItems title="Yearly income" value={yearlyIncomes} rates={rates} updateFn={updateYearly} multiplier={yearlyMultiplier} />
            </form>
        </div>
    );
};
