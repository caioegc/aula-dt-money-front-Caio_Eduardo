export interface ITransaction {
    id?: string;
    title: string;
    price: number;
    category: string;
    data: string;
    type: "INCOME" | "OUTCOME";
}

export type ITotal = {
    totalIncome: number;
    totalOutcome: number;
    total: number;
}

export interface PaginatedTransactionsResponse {
    data: ITransaction[]; // O array de transações da página atual
    totalCount: number; // O número total de transações no banco de dados (para calcular o total de páginas)
}