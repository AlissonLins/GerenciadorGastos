"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();


    return (
        <header className="h-16 flex-none bg-green-500 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center py-3">
                <Link href="/">
                    <span className="text-2xl font-bold text-white">Gerenciador de gastos</span>
                </Link>

                <nav>
                    <ul className="hidden md:flex space-x-6 text-white">
                        <li>
                            <Link href="/" className={`hover:border-b-2 border-white ${pathname === '/' ? 'border-b-2' : ''}`}> Visão Geral</Link>
                        </li>

                        <li>
                            <Link href="/Lancamento" className={`hover:border-b-2 border-white ${pathname === '/Lancamento' ? 'border-b-2' : ''}`}> Lançamentos</Link>
                        </li>

                        <li>
                            <Link href='/Limites' as={`${process.env.basePath}/Limites`}>Limite Gastos</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}