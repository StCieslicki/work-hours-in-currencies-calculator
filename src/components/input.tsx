// export const Input: React.FC = ({ label, name, value, disabled, onChange }): JSX.Element => {
import clsx from "clsx";


import {Dispatch, SetStateAction} from "react";
// export const Input: React.FC = ({label, type, name, value, placeholder, disabled, onChange, className }): JSX.Element => {
//@ts-ignore
export const Input = ({label, type, name, value, placeholder, disabled, onChange, className }: {label: string, name:string, value:number, type?:string, placeholder?:string, disabled?: boolean, onChange?: any, className?:string }) => {
    return (
        <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
            <label htmlFor="year" className={clsx("block text-xs font-medium", !className && 'text-zinc-100', className, disabled && 'text-zinc-500')}>
                {label}
            </label>
            <input
                type={type ? type : 'number'}
                name={name}
                id={name}
                className={clsx('w-full p-0 text-base bg-transparent border-0 apperance-none placeholder-zinc-500 focus:ring-0 sm:text-sm', !className && 'text-zinc-100', className, disabled && 'text-zinc-500')}
                value={value}
                onChange={(e) => {
                    onChange(e.target.valueAsNumber);
                }}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}
