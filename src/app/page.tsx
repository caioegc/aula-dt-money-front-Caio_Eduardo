// src/app/page.tsx

"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { useTransaction } from "@/hooks/transactions";
import { ITransaction, ITotal } from "@/types/transaction";
import { useMemo, useState } from "react"; // useMemo NÃO será mais usado para totais
import { ToastContainer } from "react-toastify";
import { Modal } from "@/components/Modal";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: paginatedData, isLoading, isError } = useTransaction.ListAll(currentPage, itemsPerPage);
  
  const transactions = paginatedData?.data || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // NOVO: Extrair os totais globais do paginatedData
  const globalTotalIncome = paginatedData?.totalIncome || 0;
  const globalTotalOutcome = paginatedData?.totalOutcome || 0;
  const globalTotal = paginatedData?.total || 0;


  const createTransactionMutation = useTransaction.Create();
  
  const openModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const updateTransactionMutation = useTransaction.Update();

  const handleEditTransactionClick = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (transactionData: ITransaction) => {
    console.log("Page: handleSaveTransaction chamado com dados:", transactionData);
    if (editingTransaction) {
      updateTransactionMutation.mutate(
        { ...transactionData, id: editingTransaction.id },
        {
          onSuccess: () => {
            console.log("Page: updateTransactionMutation SUCESSO!");
          },
          onError: (error) => {
            console.error("Page: updateTransactionMutation ERRO:", error);
            alert("Erro ao atualizar transação. Tente novamente.");
          }
        }
      );
    } else {
      createTransactionMutation.mutate(
        transactionData,
        {
          onSuccess: () => {
            console.log("Page: createTransactionMutation SUCESSO!");
          },
          onError: (error) => {
            console.error("Page: createTransactionMutation ERRO:", error);
            alert("Erro ao criar transação. Tente novamente.");
          }
        }
      );
    }
  };

  // REMOVIDO: O useMemo para totalTransactions NÃO É MAIS NECESSÁRIO
  // pois os totais virão diretamente do backend.
  // Se CardContainer espera ITotal, podemos construir um objeto ITotal com os totais globais.
  const globalTotalsForCards: ITotal = {
      totalIncome: globalTotalIncome,
      totalOutcome: globalTotalOutcome,
      total: globalTotal
  };


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<string | null>(null);
  const deleteMutation = useTransaction.Delete();

  const handleDeleteTransactionClick = (transactionId: string) => {
    setTransactionToDeleteId(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDeleteId) {
      deleteMutation.mutate(transactionToDeleteId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setTransactionToDeleteId(null);
        },
        onError: (error) => {
          console.error("Erro ao excluir transação:", error);
          alert("Erro ao excluir transação. Tente novamente.");
        }
      });
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDeleteId(null);
  };

  if (isLoading) return <div>Carregando transações...</div>;
  if (isError) return <div>Erro ao carregar transações.</div>;
  if (totalCount === 0 && !isLoading) return <div>Nenhuma transação encontrada.</div>;

  return (
    <div>
      <ToastContainer />
      <Header openModal={openModal} />
      <BodyContainer>
        {/* Passa os totais globais para o CardContainer */}
        <CardContainer totals={globalTotalsForCards} /> 
        
        <Table
          data={transactions}
          onDelete={handleDeleteTransactionClick}
          onEdit={handleEditTransactionClick}
        />

        <div className="flex justify-center items-center mt-8 space-x-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
                Anterior
            </button>
            <span>Página {currentPage} de {totalPages} ({totalCount} transações)</span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
                Próxima
            </button>
        </div>

        {isModalOpen && (
          <FormModal
            closeModal={handleCloseModal}
            formTitle={editingTransaction ? "Editar Transação" : "Adicionar Transação"}
            saveTransaction={handleSaveTransaction}
            initialData={editingTransaction}
          />
        )}

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Confirmar Exclusão"
          footer={
            <>
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar'}
              </button>
            </>
          }
        >
          <p>Você tem certeza que deseja excluir esta transação?</p>
        </Modal>
      </BodyContainer>
    </div>
  );
}