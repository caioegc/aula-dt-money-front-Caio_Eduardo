// src/types/transaction.ts

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

// Interface ATUALIZADA com totais globais
export interface PaginatedTransactionsResponse {
    data: ITransaction[];
    totalCount: number;
    totalIncome: number; 
    totalOutcome: number; 
    total: number;       
}