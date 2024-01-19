import {PropsWithChildren} from "react";

export const Row: React.FC<PropsWithChildren> = ({ children, title }): JSX.Element => {
    return (
        <>
        {title && <h2>{title}</h2>}

        <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:flex-row">
            {children}
        </div>
        </>
    );
};
