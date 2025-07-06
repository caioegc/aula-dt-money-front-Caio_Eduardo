// src/services/transactions.ts

import { ITransaction, PaginatedTransactionsResponse } from "@/types/transaction"; // Importa PaginatedTransactionsResponse do types
import { api } from "../api";
import { toast } from "react-toastify";

// A interface PaginatedTransactionsResponse NÃO precisa ser definida aqui novamente.
// Ela já é importada da linha acima.

export async function getTransactions(skip?: number, take?: number): Promise<PaginatedTransactionsResponse> {
    try {
        let url = '/transaction';
        const params = new URLSearchParams();

        if (skip !== undefined) {
            params.append('skip', String(skip));
        }
        if (take !== undefined) {
            params.append('take', String(take));
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await api.get(url);
        return response.data as PaginatedTransactionsResponse; 
    } catch (error) {
        throw new Error("Erro ao buscar transações: " + (error instanceof Error ? error.message : String(error)));
    }
}

export async function createTransaction(transaction: ITransaction) {
    try {
        const response = await api.post('/transaction', transaction);
        toast.success("Transação adicionada com sucesso!");
        return response.data;
    } catch (error) {
        throw new Error("Erro ao criar transação: " + (error instanceof Error ? error.message : String(error)));
    }
}

export async function deleteTransaction(transactionId: string) {
    try {
        await api.delete(`/transaction/${transactionId}`);
        toast.success("Transação excluída com sucesso!");
    } catch (error) {
        throw new Error("Erro ao excluir transação: " + (error instanceof Error ? error.message : String(error)));
    }
}

export async function updateTransaction(transaction: ITransaction) {
    try {
        await api.patch(`/transaction/${transaction.id}`, transaction);
        toast.success("Transação atualizada com sucesso!");
    } catch (error) {
        throw new Error("Erro ao atualizar transação: " + (error instanceof Error ? error.message : String(error)));
    }
}