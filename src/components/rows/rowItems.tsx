import {PropsWithChildren} from "react";
import {Input} from "../input";
import {Row} from "../row";
import {CurrenciesList, recalculateCurrencies} from "../../utils/currencies";
import {shortendNumber} from "../../utils/utils";

export const RowItems: React.FC<PropsWithChildren & {title: string, value: CurrenciesList, rates: CurrenciesList, multiplier?: number, updateFn: Function}> = (
    { title, value, rates, multiplier = 1, updateFn }
): JSX.Element => {
    const recalculate = ({data}: CurrenciesList) => {
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];

        const recalculated = recalculateCurrencies({ [key]: shortendNumber(value / multiplier) }, rates);

        updateFn({recalculated, key, value});
    }

    const nameGenerator = (title: string, currency: string) => {
        return `${title.replaceAll(' ', '')}${currency}`;
    }

    return (
        <>
            <Row title={title}>
                <Input
                    name={nameGenerator(title, 'Pln')}
                    value={value.pln}
                    currency="pln"
                    onChange={recalculate}
                />

                <Input
                    name={nameGenerator(title, 'Usd')}
                    value={value.usd}
                    currency="usd"
                    onChange={recalculate}
                    disabled={rates.usd ? false : false}
                />

                <Input
                    name={nameGenerator(title, 'Eur')}
                    value={value.eur}
                    currency="eur"
                    onChange={recalculate}
                    disabled={rates.eur ? false : false}
                />
            </Row>
        </>
    );
};
