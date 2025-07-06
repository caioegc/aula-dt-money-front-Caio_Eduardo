import { date, InferType, number, object, string } from "yup";
import { Input } from "../Form/Input";
import { TransactionSwitcher } from "../TransactionSwitcher";
import { ITransaction } from "@/types/transaction";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

export interface IFormModalProps {
    formTitle: string;
    closeModal: () => void;
    saveTransaction: (transaction: ITransaction) => void;
    initialData: ITransaction | null;
}

const transactionSchema = object({
    title: string()
        .required('O Título é obrigatório')
        .min(5, 'O Título deve ter pelo menos 5 caracteres'),
    type: string()
        .required('O Tipo é obrigatório')
        .oneOf(['INCOME', 'OUTCOME'], 'O Tipo deve ser "INCOME" ou "OUTCOME"'),
    category: string()
        .required('A Categoria é obrigatória'),
    price: number()
        .required('O Preço é obrigatório')
        .positive('O preço deve ser um número positivo')
        .min(0.01, 'O preço deve ser maior que zero'),
    data: date()
        .required('A Data é obrigatória')
        .default(() => new Date())
})

type ITransactionForm = InferType<typeof transactionSchema>

const transactionFormDefaultValues: ITransactionForm = {
    title: '',
    type: 'INCOME',
    category: '',
    price: 0,
    data: new Date()
}

type TransactionType = 'INCOME' | 'OUTCOME';

const formatToInputDate = (isoDateString?: string | Date) => {
    if (!isoDateString) return '';
    const dateObj = new Date(isoDateString);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
};

export function FormModal({ formTitle, closeModal, saveTransaction, initialData }: IFormModalProps) {
    const {
        handleSubmit,
        setValue,
        watch,
        register,
        formState: { errors },
        reset
    } = useForm<ITransactionForm>({
        resolver: yupResolver(transactionSchema),
        defaultValues: initialData ? {
            ...initialData,
            data: formatToInputDate(initialData.data) as any
        } : { 
            ...transactionFormDefaultValues, 
            data: formatToInputDate(new Date()) as any
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                data: formatToInputDate(initialData.data) as any
            });
        } else {
            reset({
                ...transactionFormDefaultValues,
                data: formatToInputDate(new Date()) as any
            });
        }
    }, [initialData, reset]);

    const handleSetType = (type: 'INCOME' | 'OUTCOME') => {
        setValue('type', type);
    }

    const type = watch('type', 'INCOME');

    const onSubmit = (formData: ITransactionForm) => {
        const transactionToSave: ITransaction = {
            title: formData.title,
            price: formData.price,
            category: formData.category,
            data: formData.data.toISOString(),
            type: formData.type as 'INCOME' | 'OUTCOME', // Garante o tipo literal
            id: initialData?.id
        };
        saveTransaction(transactionToSave);
        closeModal();
    }

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-modal text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <button
                            type="button"
                            className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
                            onClick={closeModal}
                            aria-label="Fechar">
                            <span className="text-2xl">&times;</span>
                        </button>
                        <div className="bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h1 className="font-semibold leading-9 text-title text-2xl" id="modal-title">{formTitle}</h1>
                                </div>
                            </div>
                        </div>
                        <form className="flex flex-col gap-4 px-12 mt-4 mb-6" onSubmit={handleSubmit(onSubmit)}>
                            <Input type="text" placeholder="Título" {...register("title")} />
                            {errors.title && <span className="text-red-500">{errors.title.message}</span>}

                            <Input 
                                type="number" 
                                placeholder="Preço" 
                                step="0.01"
                                {...register("price", { valueAsNumber: true })} 
                            />
                            {errors.price && <span className="text-red-500">{errors.price.message}</span>}

                            <TransactionSwitcher setType={handleSetType} type={type as TransactionType} />
                            {errors.type && <span className="text-red-500">{errors.type.message}</span>}

                            <Input type="text" placeholder="Categoria" {...register("category")} />
                            {errors.category && <span className="text-red-500">{errors.category.message}</span>}

                            <Input
                                type="date"
                                placeholder="Data"
                                {...register("data")}
                            />
                            {errors.data && <span className="text-red-500">{errors.data.message}</span>}

                            <div className="bg-modal px-12 py-3 flex sm:flex-row-reverse w-full mb-11">
                                <button type="submit" className="mt-3 w-full justify-center rounded-md bg-income text-white px-3 py-5 text-normal font-semibold shadow-sm hover:opacity-80 sm:mt-0">
                                    {initialData ? "Salvar Alterações" : "Confirmar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}