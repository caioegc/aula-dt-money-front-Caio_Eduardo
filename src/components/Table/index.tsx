import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";

export interface ITableProps {
    data: ITransaction[];
    onDelete?: (transactionId: string) => void;
    onEdit?: (transaction: ITransaction) => void;
}

export function Table({ data, onDelete, onEdit }: ITableProps) {
    return (
        <>
            <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
                <thead>
                    <tr>
                        <th className="px-4 text-left text-table-header text-base font-medium">Título</th>
                        <th className="px-4 text-left text-table-header text-base font-medium">Preço</th>
                        <th className="px-4 text-left text-table-header text-base font-medium">Categoria</th>
                        <th className="px-4 text-left text-table-header text-base font-medium">Data</th>
                        <th className="px-4 text-left text-table-header text-base font-medium">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((transaction) => (
                        <tr key={transaction.id!} className="bg-white h-16 rounded-lg"> 
                            <td className="px-4 py-4 whitespace-nowrap text-title">{transaction.title}</td>
                            <td className={`px-4 py-4 whitespace-nowrap text-right ${transaction.type === 'INCOME' ? "text-income" : "text-outcome"}`}>{formatCurrency(transaction.price)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.category}</td>
                            {/* LINHA ADICIONADA: Célula para a Data */}
                            <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.data ? formatDate(new Date(transaction.data)) : ''}</td>
                            {/* A célula de Ações agora é a 5ª td, correspondendo ao 5º th */}
                            <td className="px-4 py-4 whitespace-nowrap text-table space-x-2"> 
                                <button
                                    onClick={() => onEdit?.(transaction)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete?.(transaction.id!)} 
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}