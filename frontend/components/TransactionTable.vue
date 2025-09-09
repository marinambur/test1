<template>
  <div class="transaction-table">
    <!-- Loading State -->
    <div v-if="store.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p class="text-red-800">{{ store.error }}</p>
      <button 
        @click="refetch" 
        class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.isEmpty" class="text-center py-12">
      <div class="text-gray-500 text-lg mb-2">No transactions found</div>
      <p class="text-gray-400 mb-4">Try adjusting your filters or create a new transaction</p>
      <button 
        @click="resetAndRefetch" 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Clear Filters
      </button>
    </div>

    <!-- Transaction Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Table Header -->
      <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div class="grid grid-cols-5 gap-4 font-medium text-gray-700">
          <div>Date</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Currency</div>
          <div>Description</div>
        </div>
      </div>

      <!-- Virtual List Container -->
      <div class="relative" style="height: 400px;">
        <div
          ref="scrollContainer"
          class="overflow-auto"
          style="height: 100%;"
          @scroll="onScroll"
        >
          <div :style="{ height: totalHeight + 'px' }" class="relative">
            <div
              v-for="(transaction, index) in visibleTransactions"
              :key="`${transaction.id}-${index}`"
              :style="{
                position: 'absolute',
                top: getItemTop(index) + 'px',
                left: 0,
                right: 0,
                height: itemHeight + 'px'
              }"
              class="px-6 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-center"
            >
              <div class="grid grid-cols-5 gap-4 w-full">
                <div class="text-sm text-gray-900">
                  {{ formatDate(transaction.date) }}
                </div>
                <div>
                  <span
                    :class="getTypeColor(transaction.type)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ transaction.type }}
                  </span>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatAmount(transaction.amount) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ transaction.currency }}
                </div>
                <div class="text-sm text-gray-600 truncate">
                  {{ transaction.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (store.filters.page - 1) * store.filters.limit + 1 }} to 
                    {{ Math.min(store.filters.page * store.filters.limit, store.total || 0) }} of
        {{ store.total || 0 }} results
          </div>
          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="!store.hasPreviousPage"
              class="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="!store.hasNextPage"
              class="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { Transaction, TransactionType } from '~/types/transaction'

const store = useTransactionStore()
const { refetch, nextPage, previousPage, resetAndRefetch } = useTransactions()

// Virtual scrolling properties
const itemHeight = 60
const containerHeight = 400
const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
const scrollContainer = ref<HTMLElement>()

// Virtual scrolling state
const scrollTop = ref(0)
const startIndex = computed(() => Math.floor(scrollTop.value / itemHeight))
const endIndex = computed(() => Math.min(startIndex.value + visibleCount, store.transactions.length))
const visibleTransactions = computed(() => 
  store.transactions.slice(startIndex.value, endIndex.value)
)
const totalHeight = computed(() => store.transactions.length * itemHeight)

const onScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

const getItemTop = (index: number) => {
  return (startIndex.value + index) * itemHeight
}

// Formatting helpers
const formatDate = (dateString: string) => {
  try {
    // Handle different date formats
    let date: Date;
    
    // If it's a timestamp (number as string)
    if (/^\d+$/.test(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid Date';
  }
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat(store.selectedLocale, {
    style: 'currency',
    currency: store.selectedCurrency,
    minimumFractionDigits: 2,
  }).format(amount)
}

const getTypeColor = (type: TransactionType) => {
  switch (type) {
    case 'INCOME':
      return 'bg-green-100 text-green-800'
    case 'EXPENSE':
      return 'bg-red-100 text-red-800'
    case 'TRANSFER':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.transaction-table {
  @apply w-full;
}
</style> 
