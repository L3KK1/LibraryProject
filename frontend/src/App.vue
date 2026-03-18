<!-- App.vue -->
<template>
  <div class="library-app">
    <div class="header">
      <h1 class="title">Библиотека</h1>
      <button class="btn btn-add" @click="openAddForm">+ Новая книга</button>
    </div>

    <div class="filters">
      <select v-model="selectedGenreId" class="genre-select">
        <option value="">Все жанры</option>
        <option v-for="genre in genres" :key="genre.genre_id" :value="genre.genre_id">
          {{ genre.name || genre.genre_name || `Жанр #${genre.genre_id}` }}
        </option>
      </select>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск книги по названию..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredBooks.length === 0" class="empty">
      Книги не найдены
    </div>
    <table v-else class="books-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Год</th>
          <th>Издательство</th>
          <th>Жанр</th>
          <th>Страниц</th>
          <th>Описание</th>
          <th>Изменить</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
        <TableItem
          v-for="book in filteredBooks"
          :key="book.book_id"
          :book="book"
          :genres="genres"
          @edit="openEditForm"
          @delete="deleteBook"
        />
      </tbody>
    </table>

   
    <div v-if="showForm" class="book-form">
      <h2>{{ isEditMode ? 'Редактировать книгу' : 'Новая книга' }}</h2>

      <form @submit.prevent="saveBook">
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.title" required />
        </div>

        <div class="form-group">
          <label>Год издания</label>
          <input v-model.number="form.publication_year" type="number" required />
        </div>

        <div class="form-group">
          <label>Издательство</label>
          <input v-model="form.publisher" />
        </div>

        <div class="form-group">
          <label>Жанр</label>
          <select v-model="form.genre_id" required>
            <option v-for="g in genres" :key="g.genre_id" :value="g.genre_id">
              {{ g.name || g.genre_name || `Жанр #${g.genre_id}` }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Количество страниц</label>
          <input v-model.number="form.page_count" type="number" min="1" />
        </div>

        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-save">
            {{ isEditMode ? 'Сохранить изменения' : 'Добавить книгу' }}
          </button>
          <button type="button" class="btn btn-cancel" @click="closeForm">
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import TableItem from './components/TableItem.vue'

const books = ref([])
const genres = ref([])
const loading = ref(false)
const error = ref(null)

const searchQuery = ref('')
const selectedGenreId = ref('')

const showForm = ref(false)
const isEditMode = ref(false)
const form = ref({
  book_id: null,
  title: '',
  publication_year: null,
  publisher: '',
  genre_id: null,
  page_count: null,
  description: ''
})

const filteredBooks = computed(() => {
  let result = books.value

  // Поиск
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(b => b.title?.toLowerCase().includes(q))
  }

  // Фильтр
  if (selectedGenreId.value) {
    result = result.filter(b => b.genre_id === Number(selectedGenreId.value))
  }

  return result
})

async function fetchBooks() {
  loading.value = true
  try {
    const { data } = await axios.get('http://localhost:3001/api/books')
    if (data.success) books.value = data.data || []
    else throw new Error(data.message || 'Ошибка формата')
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить книги'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function fetchGenres() {
  try {
    const { data } = await axios.get('http://localhost:3001/api/genres')
    if (data.success) genres.value = data.data || []
  } catch (err) {
    console.warn('Не удалось загрузить жанры', err)
  }
}

function openAddForm() {
  form.value = {
    book_id: null,
    title: '',
    publication_year: null,
    publisher: '',
    genre_id: null,
    page_count: null,
    description: ''
  }
  isEditMode.value = false
  showForm.value = true
}

function openEditForm(book) {
  form.value = { ...book }
  isEditMode.value = true
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function saveBook() {
  try {
    if (isEditMode.value) {
      
      await axios.put(`http://localhost:3001/api/books/${form.value.book_id}`, form.value)
    } else {
  
      await axios.post('http://localhost:3001/api/books', form.value)
    }
    closeForm()
    fetchBooks() 
  } catch (err) {
    alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message))
  }
}

async function deleteBook(bookId) {
  if (!confirm('Удалить книгу?')) return
  try {
    await axios.delete(`http://localhost:3001/api/books/${bookId}`)
    fetchBooks()
  } catch (err) {
    alert('Ошибка удаления: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  fetchBooks()
  fetchGenres()
})
</script>

<style scoped>
/* ────────────────────────────────────── */
.library-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  margin: 0;
  color: #2d3748;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-add {
  background: #3182ce;
  color: white;
}

.btn-add:hover {
  background: #2b6cb0;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.genre-select,
.search-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.books-table th {
  background: #2d3748;
  color: white;
  padding: 12px;
  text-align: left;
}

.books-table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

tr:hover {
  background: #f7fafc;
}

.book-form {
  margin-top: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.btn-save {
  background: #38a169;
  color: white;
}

.btn-save:hover {
  background: #2f855a;
}

.btn-cancel {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.empty, .loading, .error {
  text-align: center;
  padding: 40px;
  color: #718096;
}
</style>