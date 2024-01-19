import Link from "next/link";

export const Footer:React.FC = () => {
    return (
        <footer className="bottom-0 border-t inset-2x-0 border-zinc-500/10">
            <div className="flex flex-col gap-1 px-6 py-12 mx-auto text-xs text-center text-zinc-700 max-w-7xl lg:px-8">
                <p>
                    Build by{" "}
                    <Link href="#" className="font-semibold duration-150 hover:text-zinc-200">@stahoos</Link>
                </p>
                <p>
                    Currency Calculator is deployed on{" "}
                    <Link target="_blank" href="https://vercel.com" className="font-semibold duration-150 hover:text-zinc-200">Vercel</Link>
                </p>
            </div>
        </footer>
    );
}
