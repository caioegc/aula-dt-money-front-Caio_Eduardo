import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from "@/services/transactions"
import { useMutation, useQuery, useQueryClient, QueryFunctionContext } from "@tanstack/react-query"
import { PaginatedTransactionsResponse } from "@/types/transaction";

const QUERY_KEY = 'qkTransaction'

const Create = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}

const ListAll = (page: number = 1, pageSize: number = 10) => {
  const fetchTransactionsWithPagination = async ({ queryKey }: QueryFunctionContext<[string, { page: number, pageSize: number }]>) => {
    const [_queryKeyBase, { page: currentPageParam, pageSize: currentPageSizeParam }] = queryKey;
    const skip = (currentPageParam - 1) * currentPageSizeParam;
    const take = currentPageSizeParam;
    return getTransactions(skip, take);
  };

  return useQuery<
    PaginatedTransactionsResponse,
    unknown,
    PaginatedTransactionsResponse,
    [string, { page: number, pageSize: number }]
  >({
    queryKey: [QUERY_KEY, { page, pageSize }],
    queryFn: fetchTransactionsWithPagination,
    // REMOVIDO: keepPreviousData: true, // Esta propriedade não existe no TanStack Query v5
    placeholderData: (previousData) => previousData, // Esta é a opção correta para manter dados anteriores
    enabled: true,
  });
}

const Delete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}

const Update = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })
}

export const useTransaction = {
    Create,
    ListAll,
    Delete,
    Update,
}