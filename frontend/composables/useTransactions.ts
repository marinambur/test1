import { gql } from 'graphql-tag'
import type { 
  TransactionConnection, 
  TransactionFilters, 
  CreateTransactionInput,
  Transaction 
} from '~/types/transaction'

const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $startDate: String
    $endDate: String
    $type: TransactionType
    $minAmount: Float
    $page: Int!
    $limit: Int!
  ) {
    transactions(
      startDate: $startDate
      endDate: $endDate
      type: $type
      minAmount: $minAmount
      page: $page
      limit: $limit
    ) {
      transactions {
        id
        type
        amount
        currency
        description
        date
        createdAt
      }
      total
      page
      limit
      hasNextPage
      hasPreviousPage
    }
  }
`

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      amount
      currency
      description
      date
      createdAt
      idempotencyKey
    }
  }
`

export const useTransactions = () => {
  const store = useTransactionStore()

  const fetchTransactions = async (filters?: Partial<TransactionFilters>) => {
    try {
      store.setLoading(true)
      store.setError(null)

      // Prepare query variables
      let queryFilters = store.filters
      if (filters) {
        // Update store filters only if they're different
        store.setFilters(filters)
        queryFilters = store.filters
      }

      const { $apollo } = useNuxtApp()
      const result = await $apollo.defaultClient.query({
        query: GET_TRANSACTIONS,
        variables: queryFilters,
        fetchPolicy: 'network-only'
      })

      if (result.data?.transactions) {
        store.setTransactions(result.data.transactions)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions'
      store.setError(message)
      console.error('Error fetching transactions:', error)
    } finally {
      store.setLoading(false)
    }
  }

  const createTransaction = async (input: CreateTransactionInput): Promise<Transaction | null> => {
    try {
      store.setError(null)

      const { $apollo } = useNuxtApp()
      const result = await $apollo.defaultClient.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input }
      })

      if (result.data?.createTransaction) {
        store.addTransaction(result.data.createTransaction)
        return result.data.createTransaction
      }

      return null
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create transaction'
      store.setError(message)
      console.error('Error creating transaction:', error)
      return null
    }
  }

  const refetch = () => {
    return fetchTransactions()
  }

  const nextPage = () => {
    if (store.hasNextPage) {
      store.setPage(store.filters.page + 1)
      return fetchTransactions()
    }
  }

  const previousPage = () => {
    if (store.hasPreviousPage) {
      store.setPage(store.filters.page - 1)
      return fetchTransactions()
    }
  }

  const resetAndRefetch = () => {
    store.resetFilters()
    return fetchTransactions()
  }

  return {
    fetchTransactions,
    createTransaction,
    refetch,
    nextPage,
    previousPage,
    resetAndRefetch,
  }
} 
