"use client";
import { useFinance } from "../components/FinanceContext";


export default function Home() {
  const { totalReceitas, totalDespesas } = useFinance();

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 w-2/3 mx-auto mt-12">
      <div className="flex mt-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center">

            {/* Receita mensal */}
            <div className="flex-1 p-2 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800">Receita Mensal</h2>
              <p className="text-2xl font-bold text-green-400">
                {totalReceitas.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>

            {/* divisória */}
            <div className="border-l-2 border-gray-300 h-16 mx-4"></div>

            {/* Despesa mensal */}
            <div className="flex-1 p-2 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800">Despesa Mensal</h2>
              <p className="text-2xl font-bold text-red-400">
                {totalDespesas.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}