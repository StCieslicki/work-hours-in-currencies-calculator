import {PropsWithChildren} from "react";

export const Row: React.FC<PropsWithChildren & {title?: string, description?:string}> = (
    { children, title = '', description = '' }
): JSX.Element => {
    return (
        <>
        {/*{title && <h2 className="mt-5 mb-0 flex flex-col sm:items-center sm:justify-center sm:flex-row">{title} <span className="text-xs text-zinc-400">{description}</span></h2>}*/}
        {title && <h2 className="mt-3 mb-0 flex flex-col justify-between items-center sm:flex-row">
            <span className="mr-5">{title}</span>
            <span className="text-xs text-zinc-400">{description}</span>
        </h2>}

        <div className="flex flex-col items-center justify-center w-full gap-4 mt-1 sm:flex-row">
            {children}
        </div>
        </>
    );
};
