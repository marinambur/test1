export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: Currency
  description: string
  date: string
  createdAt: string
  idempotencyKey?: string
}

export interface TransactionConnection {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  type?: TransactionType
  minAmount?: number
  page: number
  limit: number
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  currency: Currency
  description: string
  date: string
  idempotencyKey?: string
} 
