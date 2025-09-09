import { defineStore } from "pinia";
import {
  type Transaction,
  type TransactionConnection,
  type TransactionFilters,
  type CreateTransactionInput,
  type TransactionType,
  Currency,
} from "~/types/transaction";

export const useTransactionStore = defineStore("transaction", () => {
  // State
  const transactions = ref<Transaction[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Filters state
  const filters = ref<TransactionFilters>({
    page: 1,
    limit: 20,
    startDate: undefined,
    endDate: undefined,
    type: undefined,
    minAmount: undefined,
  });

  // Preferences
  const selectedCurrency = ref<Currency>(Currency.USD);
  const selectedLocale = ref("en-US");

  // Computed
  const hasNextPage = computed(() => {
    return filters.value.page * filters.value.limit < total.value;
  });

  const hasPreviousPage = computed(() => {
    return filters.value.page > 1;
  });

  const isEmpty = computed(() => {
    return !loading.value && transactions.value.length === 0;
  });

  // Actions
  const setFilters = (newFilters: Partial<TransactionFilters>) => {
    filters.value = {
      ...filters.value,
      ...newFilters,
      page: newFilters.page || 1, // Reset to first page when filters change
    };
  };

  const setPage = (page: number) => {
    filters.value.page = page;
  };

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 20,
      startDate: undefined,
      endDate: undefined,
      type: undefined,
      minAmount: undefined,
    };
  };

  const setCurrency = (currency: Currency) => {
    selectedCurrency.value = currency;
  };

  const setLocale = (locale: string) => {
    selectedLocale.value = locale;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const setTransactions = (data: TransactionConnection) => {
    transactions.value = data.transactions;
    total.value = data.total;
  };

  const addTransaction = (transaction: Transaction) => {
    transactions.value.unshift(transaction);
    total.value += 1;
  };

  const clearTransactions = () => {
    transactions.value = [];
    total.value = 0;
  };

  return {
    // State
    transactions: readonly(transactions),
    total: readonly(total),
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    selectedCurrency: readonly(selectedCurrency),
    selectedLocale: readonly(selectedLocale),

    // Computed
    hasNextPage,
    hasPreviousPage,
    isEmpty,

    // Actions
    setFilters,
    setPage,
    resetFilters,
    setCurrency,
    setLocale,
    setLoading,
    setError,
    setTransactions,
    addTransaction,
    clearTransactions,
  };
});
