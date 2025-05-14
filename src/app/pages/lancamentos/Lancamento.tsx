"use client";

import { useFinance } from "@/components/FinanceContext";
import { useState } from "react";

interface Lancamento {
    descricao: string;
    valor: number;
    tipo: "receita" | "despesa";
    data: string;
    id: string;
    categoria?: string;
}

export default function Lancamento() {
    const {
        lancamentos,
        addLancamento,
        removeLancamento,
        categorias,
        getGastoPorCategoria,
    } = useFinance();

    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState<Omit<Lancamento, 'id'>>({
        descricao: "",
        valor: 0,
        tipo: "receita",
        data: "",
        categoria: "",
       
    });

    const parseCurrency = (value: string): number => {
        const cleanValue = value.replace(/[^\d,]/g, '');

        const numericValue = cleanValue.replace(/\./g, '').replace(',', '.');

        return parseFloat(numericValue) || 0;
    };

    const [rawValue, setRawValue] = useState(""); 

    const toggleForm = () => {
        setShowForm(!showForm);
        setErrorMessage("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'valor') {
            setRawValue(value);
            setFormData({
                ...formData,
                [name]: parseCurrency(value)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericValue = parseCurrency(rawValue);

        if (!formData.descricao || !numericValue || !formData.data) {
            alert("Preencha todos os campos");
            return;
        }

        if (formData.tipo === "despesa" && formData.categoria) {
            const categoriaObj = categorias.find(c => c.name === formData.categoria);
            if (categoriaObj) {
                const gastoAtual = getGastoPorCategoria(formData.categoria);


                const novoGasto = Number(gastoAtual) + Number(numericValue);

                if (novoGasto > categoriaObj.limit) {
                    setErrorMessage(`Limite excedido para ${formData.categoria}! 
                    Limite: R$ ${categoriaObj.limit.toFixed(2)} 
                    Gasto atual: R$ ${Number(gastoAtual).toFixed(2)} 
                    Tentativa: R$ ${numericValue.toFixed(2)}`);
                    return;
                }
            }
        }

        addLancamento({
            ...formData,
            valor: numericValue,
        });

        
        setFormData({
            descricao: "",
            valor: 0,
            tipo: "receita",
            data: "",
            categoria: "",
        });
        setRawValue("");
        setShowForm(false);
        setErrorMessage("");
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-5 w-96 mx-auto mt-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Lançamentos</h1>
                <button onClick={toggleForm}
                    className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-blue-600 transition-color">
                    +
                </button>
            </div>

            <div className="border-t border-gray-300 mb-6"></div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">Saldo Atual: </p>
                <p className="text-2xl font-bold text-green-600">
                    {" "}
                    {lancamentos.reduce((total, lancamento) => {
                        return lancamento.tipo === "receita"
                            ? total + lancamento.valor
                            : total - lancamento.valor;
                    }, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
                </p>
            </div>

            <div className="overflow-y-auto max-h-64">
                <div className="space-y-4">
                    {lancamentos.map((lancamento) => (
                        <div
                            key={lancamento.id}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <p className="font-semibold">{lancamento.descricao}</p>
                                <p className="text-sm text-gray-500">{lancamento.data}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p
                                    className={`font-bold ${lancamento.tipo === "receita" ? "text-green-600" : "text-red-600"}`}
                                >
                                    {lancamento.tipo === "receita" ? "+" : "-"}
                                    {lancamento.valor.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </p>
                                <button
                                    onClick={() => removeLancamento(lancamento.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remover lançamento"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Adicionar Lançamentos</h2>
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Categoria (opcional)</label>
                                <select name="categoria" 
                                value={formData.categoria || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Tipo</label>
                                <select name="tipo" value={formData.tipo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="receita">Receita</option>
                                    <option value="despesa">Despesas</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Descrição </label>
                                <input type="text"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Valor</label>
                                <input
                                    type="text"
                                    name="valor"
                                    value={rawValue}
                                    onChange={(e) => {
                                        setRawValue(e.target.value); 
                                    }}
                                    onBlur={(e) => {
                                        const numericValue = parseCurrency(e.target.value);
                                        setFormData({
                                            ...formData,
                                            valor: numericValue,
                                        });
                                        
                                        setRawValue(
                                            numericValue.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })
                                        );
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Data</label>
                                <input type="date"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button"
                                    onClick={toggleForm}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                    Cancelar
                                </button>

                                <button type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {lancamentos.length === 0 && (
                <div className="text-center text-gray-600 mt-6">
                    <p>Clique no botão + e comece a fazer seus lançamentos</p>
                </div>
            )}
        </div>
    )
}