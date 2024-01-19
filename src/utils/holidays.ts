import Holidays from 'date-holidays';

function getHolidays(year, country = 'PL') {
    const holidays = new Holidays(country);

    return holidays.getHolidays(year).map((holiday) => holiday.date.slice(0,10));
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getWeekendDays(year) {
    const saturdays = [];
    const sundays = [];

    for (let m = 0; m < 12; m++){
        const days = daysInMonth(m, year);

        for (let d = 1; d < days; d++) {
            let data = new Date(
                new Date().setUTCFullYear(year, m, d)
            );

            if (data.getUTCDay() === 0) {
                sundays.push(data.toISOString().slice(0, 10));
            }

            if (data.getUTCDay() === 6) {
                saturdays.push(data.toISOString().slice(0, 10));
            }
        }
    }

    return { saturdays, sundays };
}

function getFreeDays(year) {
    const daysSet = new Set();

    const { saturdays, sundays } = getWeekendDays(year);
    const holidays = getHolidays(year);

    saturdays.forEach((day) => daysSet.add(day));
    sundays.forEach((day) => daysSet.add(day));
    holidays.forEach((day) => daysSet.add(day));

    return Array.from(daysSet);
}

function getFreeDaysInMonth(year, month) {
    let find;

    if (month < 10) {
        find = `-0${month}-`;
    } else {
        find = `-${month}-`;
    }

    return getFreeDays(year).filter((element) => element.includes(find));
}

export function getFreeDaysCount(year) {
    return getFreeDays(year).length;
}

export function getYearDaysCount(year) {
    const start = new Date(new Date().setUTCFullYear(year, 0, 0));
    const end = new Date(new Date().setUTCFullYear(year + 1, 0, 0));

    return (end - start) / 1000 / 24 / 60 / 60;
}

export function getWorkingDays(year) {
    return getYearDaysCount(year) - getFreeDaysCount(year);
}

const year = 2024;

let vatRate = 1;
let currencyRate = 1;

let hourRate;
let leaveDays;
let leaveDaysRate;

const dayInYear = getYearDaysCount(year);