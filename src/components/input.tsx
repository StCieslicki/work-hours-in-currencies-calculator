// export const Input: React.FC = ({ label, name, value, disabled, onChange }): JSX.Element => {
import clsx from "clsx";

export const Input: React.FC = (props): JSX.Element => {
    return (
        <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
            <label htmlFor="year" className={clsx("block text-xs font-medium", !props.className && 'text-zinc-100', props.className, props.disabled && 'text-zinc-500')}>
                {props.label}
            </label>
            <input
                type={props.type ? props.type : 'number'}
                name={props.name}
                id={props.name}
                className={clsx('w-full p-0 text-base bg-transparent border-0 apperance-none placeholder-zinc-500 focus:ring-0 sm:text-sm', !props.className && 'text-zinc-100', props.className, props.disabled && 'text-zinc-500')}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.valueAsNumber);
                }}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
        </div>
    );
}
