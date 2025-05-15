"use client";
import { createContext, useContext, useState, ReactNode } from "react";

import { format } from "date-fns";

export interface Lancamento {
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    data: string;
    id: string;
    
    categoria?: string;
}

interface CategoriaLimite {
    id: number;
    name: string;
    limit: number;
}

interface FinanceContextType {
    lancamentos: Lancamento[];
    addLancamento: (lancamento: Omit<Lancamento, 'id'>) => void;
    removeLancamento: (id: string) => void;
    categorias: CategoriaLimite[];
    addCategoria: (name: string, limit: number) => void;
    getGastoPorCategoria: (categoria: string) => number;
    totalReceitas: number;
    totalDespesas: number;
}

const FinanceContext = createContext<FinanceContextType>({
    lancamentos: [],
    addLancamento: () => { },
    removeLancamento: () => { },
    categorias: [],
    addCategoria: () => { },
    getGastoPorCategoria: () => 0,
    totalReceitas: 0,
    totalDespesas: 0,
});

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
    const [categorias, setCategorias] = useState<CategoriaLimite[]>([]);

    const totalReceitas = lancamentos
        .filter(l => l.tipo === "receita")
        .reduce((total, l) => total + l.valor, 0);

    const totalDespesas = lancamentos
        .filter(l => l.tipo === "despesa")
        .reduce((total, l) => total + l.valor, 0);

    const addLancamento = (lancamento: Omit<Lancamento, 'id'>) => {
        setLancamentos([...lancamentos, {
            ...lancamento,
            id: Math.random().toString(36).substring(2, 9)
        }]);
    };

    const removeLancamento = (id: string) => {
        setLancamentos(lancamentos.filter(l => l.id !== id));
    };

    const addCategoria = (name: string, limit: number) => {
        setCategorias([...categorias, {
            id: Date.now(),
            name,
            limit
        }]);
    };

    const getGastoPorCategoria = (categoria: string, month?: string): number => {
        const total = lancamentos
            .filter(l => l.tipo === "despesa"
                && l.categoria === categoria
                && (month ? format(new Date(l.data), 'yyyy-MM') === month : true))
            .reduce((total, l) => total + l.valor, 0);

        return total;
    };

    return (
        <FinanceContext.Provider
            value={{
                lancamentos,
                addLancamento,
                removeLancamento,
                categorias,
                addCategoria,
                getGastoPorCategoria,
                totalReceitas,
                totalDespesas
            }}>
            {children}
        </FinanceContext.Provider>
    );
}

export const useFinance = () => useContext(FinanceContext);