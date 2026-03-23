<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-200">
    <Header
      v-model:search-query="searchQuery"
      v-model:selected-genre-id="selectedGenreId"
      :genres="genres"
      @add-book="openAddModal"
    />

    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Статистика -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div class="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-6 flex items-center gap-5 hover:border-blue-500 transition-all">
          <div class="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl">📚</div>
          <div>
            <div class="text-5xl font-bold text-white">{{ totalBooks }}</div>
            <div class="text-zinc-400 text-lg">Всего книг</div>
          </div>
        </div>
        <div class="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-6 flex items-center gap-5 hover:border-emerald-500 transition-all">
          <div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-4xl">🔍</div>
          <div>
            <div class="text-5xl font-bold text-white">{{ books.length }}</div>
            <div class="text-zinc-400 text-lg">Найдено сейчас</div>
          </div>
        </div>
        <div class="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-6 flex items-center gap-5 hover:border-amber-500 transition-all">
          <div class="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-4xl">📖</div>
          <div>
            <div class="text-5xl font-bold text-white">{{ genres.length }}</div>
            <div class="text-zinc-400 text-lg">Жанров</div>
          </div>
        </div>
      </div>

      <BookTable
        :books="books"
        :genres="genres"
        @edit="openEditModal"
        @delete="deleteBook"
      />
    </div>

    <BookModal
      :show="showModal"
      :book="editingBook"
      :genres="genres"
      @close="closeModal"
      @save="saveBook"
    />

    <div v-if="loading" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="text-2xl text-blue-400 flex items-center gap-3">
        <span class="animate-spin">⟳</span>
        Загрузка книг...
      </div>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-400 text-xl">
      {{ error }}
    </div>

    <div v-else-if="books.length === 0 && !loading" class="text-center py-20 text-zinc-400 text-2xl">
      Книги не найдены по вашему запросу
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

import Header from './components/Header.vue'
import BookTable from './components/BookTable.vue'
import BookModal from './components/BookModal.vue'

// ==================== Данные ====================
const books = ref([])
const genres = ref([])
const loading = ref(false)
const error = ref(null)

const searchQuery = ref('')
const selectedGenreId = ref('')

const showModal = ref(false)
const editingBook = ref(null)

const totalBooks = ref(0)

// ==================== Загрузка книг ====================
const fetchBooks = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      search: searchQuery.value.trim(),
      genre: selectedGenreId.value || '',
      limit: 500,
      offset: 0
    }

    const { data } = await axios.get('http://localhost:3001/api/books', { params })

    if (data.success) {
      books.value = data.data || []
      totalBooks.value = data.pagination?.total || 0
    } else {
      throw new Error(data.message || 'Ошибка сервера')
    }
  } catch (err) {
    error.value = 'Не удалось загрузить книги'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ==================== Загрузка жанров ====================
const fetchGenres = async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/api/genres')
    genres.value = data.success ? data.data || [] : []
  } catch (err) {
    console.warn('Не удалось загрузить жанры')
  }
}

// ==================== Модальное окно ====================
const openAddModal = () => {
  editingBook.value = null
  showModal.value = true
}

const openEditModal = (book) => {
  editingBook.value = { ...book }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingBook.value = null
}

const saveBook = async (bookData) => {
  try {
    if (bookData.book_id) {
      await axios.put(`http://localhost:3001/api/books/${bookData.book_id}`, bookData)
    } else {
      await axios.post('http://localhost:3001/api/books', bookData)
    }
    closeModal()
    fetchBooks()                    
  } catch (err) {
    alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message))
  }
}

const deleteBook = async (bookId) => {
  if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return
  try {
    await axios.delete(`http://localhost:3001/api/books/${bookId}`)
    fetchBooks()                    
  } catch (err) {
    alert('Ошибка удаления: ' + (err.response?.data?.message || err.message))
  }
}

watch([searchQuery, selectedGenreId], () => {
  fetchBooks() 
})

// ==================== Инициализация ====================
onMounted(() => {
  fetchBooks()
  fetchGenres()
})
</script>