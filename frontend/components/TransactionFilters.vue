<template>
  <div class="transaction-filters bg-white rounded-lg shadow p-4 mb-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
      <div v-if="store.silentLoading" class="flex items-center text-sm text-gray-500">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
        Updating...
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          v-model="localFilters.startDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          v-model="localFilters.endDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Transaction Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <select
          v-model="localFilters.type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </div>

      <!-- Minimum Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Min Amount
        </label>
        <input
          v-model.number="localFilters.minAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end items-center mt-4">
      <button
        @click="clearFilters"
        class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Clear All
      </button>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="mt-4 p-3 bg-blue-50 rounded-md">
      <h4 class="text-sm font-medium text-blue-900 mb-2">Active Filters:</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-if="localFilters.startDate"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          From: {{ formatDisplayDate(localFilters.startDate) }}
        </span>
        <span
          v-if="localFilters.endDate"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          To: {{ formatDisplayDate(localFilters.endDate) }}
        </span>
        <span
          v-if="localFilters.type && localFilters.type !== ''"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          Type: {{ localFilters.type }}
        </span>
        <span
          v-if="localFilters.minAmount !== undefined && localFilters.minAmount > 0"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          Min Amount: {{ localFilters.minAmount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { TransactionFilters, TransactionType } from '~/types/transaction'

const store = useTransactionStore()
const { fetchTransactions } = useTransactions()

const isLoading = computed(() => store.loading)

// Local filters state for form binding (allows string values from form inputs)
interface LocalFiltersState {
  startDate?: string
  endDate?: string
  type?: TransactionType | string
  minAmount?: number
}

const localFilters = ref<LocalFiltersState>({
  startDate: store.filters.startDate,
  endDate: store.filters.endDate,
  type: store.filters.type,
  minAmount: store.filters.minAmount,
})

// Watch store filters to update local state (only on external changes)
let isInternalUpdate = false
watch(() => store.filters, (newFilters) => {
  if (!isInternalUpdate) {
    localFilters.value = {
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      type: newFilters.type,
      minAmount: newFilters.minAmount,
    }
  }
}, { deep: true })

const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.startDate ||
    localFilters.value.endDate ||
    (localFilters.value.type && localFilters.value.type !== '') ||
    (localFilters.value.minAmount !== undefined && localFilters.value.minAmount > 0)
  )
})

const applyFilters = async () => {
  const cleanFilters: Partial<TransactionFilters> = {
    startDate: localFilters.value.startDate || undefined,
    endDate: localFilters.value.endDate || undefined,
    type: (localFilters.value.type && localFilters.value.type !== '') 
      ? localFilters.value.type as TransactionType 
      : undefined,
    minAmount: (localFilters.value.minAmount !== undefined && localFilters.value.minAmount > 0) 
      ? localFilters.value.minAmount 
      : undefined
  }

  isInternalUpdate = true
  try {
    await fetchTransactions(cleanFilters, true)
  } finally {
    isInternalUpdate = false
  }
}



const clearFilters = async () => {
  localFilters.value = {
    startDate: undefined,
    endDate: undefined,
    type: undefined,
    minAmount: undefined,
  }
  
  isInternalUpdate = true
  try {
    await fetchTransactions({
      startDate: undefined,
      endDate: undefined,
      type: undefined,
      minAmount: undefined,
    }, false)
  } finally {
    isInternalUpdate = false
  }
}

const formatDisplayDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

// Auto-apply filters when they change (debounced)
const debouncedApplyFilters = useDebounceFn(() => {
  if (!isInternalUpdate) {
    applyFilters()
  }
}, 300)

watch(localFilters, () => {
  debouncedApplyFilters()
}, { deep: true })
</script> 
