// export const Input: React.FC = ({ label, name, value, disabled, onChange }): JSX.Element => {
import clsx from "clsx";


import {Dispatch, SetStateAction, useState} from "react";
import {Switch} from "@nextui-org/react";
// export const Input: React.FC = ({label, type, name, value, placeholder, disabled, onChange, className }): JSX.Element => {
//@ts-ignore
export const Input = ({
    label,
    type,
    name,
    value,
    currency,
    placeholder,
    disabled,
    onChange,
    className
}: {
    label: string,
    name:string,
    value:number,
    currency?: string,
    type?:string,
    placeholder?:string,
    disabled?: boolean,
    onChange?: any,
    className?:string
}) => {
    const [disabledState, setDisabledState] = useState(disabled);
    const [usedValue, setUsedValue] = useState(value);

    return (
        <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
            {label &&
                <label htmlFor={name}
                       className={
                           clsx(
                               "block text-xs font-medium",
                               !className && 'text-zinc-100',
                               className,
                               disabledState && 'text-zinc-500'
                           )
                       }>
                    {label}
                </label>
            }

            {!label && currency &&
                <label htmlFor={name}
                       className={
                           clsx(
                               "block text-xs font-medium",
                               !className && 'text-zinc-100',
                               className,
                               disabledState && 'text-zinc-500'
                           )
                       }>
                    {currency.toUpperCase()}
                </label>
            }

            {(!type || (type === 'number')) &&
                <input
                    type={type ? type : 'number'}
                    name={name}
                    id={name}
                    className={
                        clsx(
                            'w-full p-0 text-base bg-transparent border-0 apperance-none placeholder-zinc-500 focus:ring-0 sm:text-sm',
                            !className && 'text-zinc-100',
                            className,
                            disabledState && 'text-zinc-500'
                        )
                    }
                    value={value}
                    onChange={(e) => {
                        onChange({ value: e.target.valueAsNumber, data: {[currency]: e.target.valueAsNumber} });
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            }

            {type === 'select' &&
                <p className={clsx(disabled && 'text-zinc-500')}>{value}</p>
            }

            {type === 'checkbox-value' &&
                <div className='w-full flex flex-row justify-between items-center	'>
                    {/*<input*/}
                    {/*    className='w-4'*/}
                    {/*    type='checkbox'*/}
                    {/*    onChange={(e) => { setDisabledState(!e.target.checked)}}*/}
                    {/*    checked={!disabledState}*/}
                    {/*/>*/}

                    <Switch
                        size="sm"
                        color="success"
                        label=""
                        className={
                            clsx(
                                // 'flex-item'
                                'w-1/4'
                            )
                        }

                        onChange={(e) => {
                            // setDisabledState(!e.target.checked);
                            // onChange({ disabled: disabledState, value: usedValue });
                        }}
                        checked={!disabledState}
                    />

                    <input
                        type='number'
                        name={name}
                        id={name}
                        className={
                            clsx(
                                'p-0 text-base bg-transparent border-0 apperance-none placeholder-zinc-500 focus:ring-0 sm:text-sm',
                                !className && 'text-zinc-100',
                                className,
                                disabledState && 'text-zinc-500',
                                'w-3/4'
                            )
                        }
                        value={value}
                        onChange={(e) => {
                            setUsedValue(e.target.valueAsNumber);
                            onChange({ disabled: disabledState, value: e.target.valueAsNumber, data: {[currency]: e.target.valueAsNumber} });
                        }}
                        placeholder={placeholder}
                        disabled={disabledState ? disabledState : false }
                    />
                </div>
            }
        </div>
    );
}
