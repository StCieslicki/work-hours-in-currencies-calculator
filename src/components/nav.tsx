import Link from "next/link";

export default function Nav() {
    return (
        <nav
            className="flex flex-col sm:flex-row flex-wrap md:items-center px-4 md:px-5 lg:px-16 py-2 justify-between border-b border-gray-600 fixed top-0 z-20 w-full bg-slate-900">
            <div className="flex items-center justify-between sm:justify-around gap-x-2 text-white">
                <Link href="#!" className="py-1 flex items-center text-2xl">
                    About
                </Link>

                <button className="sm:hidden cursor-point flex flex-col justify-center gap-y-1" id="hamburger"
                        aria-label="menu">
                    <div className="w-6 h-1 rounded-lg bg-white bar-duration-300"></div>
                    <div className="w-4 h-1 rounded-lg bg-white bar-duration-300"></div>
                    <div className="w-6 h-1 rounded-lg bg-white bar-duration-300"></div>
                </button>
            </div>

            <ul
                className="hidden sm:flex text-gray-400 justify-end items-center gap-x-7 gap-y-5 tracking-wide mt-5 sm:mt-0"
                id="links">
                <li className="table-caption mb-5 sm:mb-0">
                    <Link href="#!" className="active">Home</Link>
                </li>
                <li className="table-caption mb-5 sm:mb-0">
                    <Link href="#!" className="active">Link 1</Link>
                </li>
                <li className="table-caption mb-5 sm:mb-0">
                    <Link href="#!" className="active">Link 2</Link>
                </li>


            </ul>
        </nav>
    );
}