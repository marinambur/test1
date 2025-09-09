<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p class="mt-1 text-sm text-gray-500">
              Manage and track your financial transactions
            </p>
          </div>
          
          <!-- Settings and Create Button -->
          <div class="flex items-center gap-4">
            <!-- Currency Selector -->
            <select
              v-model="selectedCurrency"
              @change="handleCurrencyChange"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
            </select>
            
            <!-- Create Transaction Button -->
            <button
              @click="showCreateModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              + New Transaction
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ (store.total || 0).toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Current Page</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ store.filters.page }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Items per Page</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ store.filters.limit }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <TransactionFilters />

      <!-- Table -->
      <TransactionTable />
    </main>

    <!-- Create Transaction Modal -->
    <CreateTransactionModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTransactionCreated"
    />
  </div>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/transaction'

const store = useTransactionStore()
const { fetchTransactions } = useTransactions()

// Local state
const showCreateModal = ref(false)
const selectedCurrency = ref<Currency>(store.selectedCurrency)

// Handle currency change
const handleCurrencyChange = () => {
  store.setCurrency(selectedCurrency.value)
}

// Handle new transaction created
const handleTransactionCreated = () => {
  showCreateModal.value = false
  // Optionally refetch data or just close modal since we add to store
}

// Load initial data
onMounted(async () => {
  await fetchTransactions()
})

// Set page title
useHead({
  title: 'Transaction History - Financial Management',
  meta: [
    { 
      name: 'description', 
      content: 'Manage and track your financial transactions with advanced filtering and pagination.' 
    }
  ]
})
</script> 
