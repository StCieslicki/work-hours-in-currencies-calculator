export const Input: React.FC = ({ label, name, value, onChange }): JSX.Element => {
    return (
        <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
            <label htmlFor="year" className="block text-xs font-medium text-zinc-100">
                {label}
            </label>
            <input
                type="number"
                name={name}
                id={name}
                className="w-full p-0 text-base bg-transparent border-0 apperance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
                value={value}
                onChange={(e) => {
                    onChange(e.target.valueAsNumber);
                }}
            />
        </div>
    );
}
